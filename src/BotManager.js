var ref = require('ref-napi');
var ffi = require('ffi-napi');
var Struct = require('ref-struct-di')(ref);
const path = require('path')
const fs = require('fs')
const { RenderManager } = require('./utils/RenderManager')

const { GameTickPacket, BallPrediction, FieldInfo } = require('./utils/flatstructs')
const { GameState } = require('./utils/GameState')

const SimpleController = require('./utils/SimpleController')

var flatbuffers = require('flatbuffers').flatbuffers;
const net = require('net');

var rlbot = require(path.join(__dirname, '../rlbot/rlbot_generated.js')).rlbot;

class BotManager {
    constructor(botClass, port, debug = false, ip = '127.0.0.1') {
        this.botClass = botClass
        this.port = port
        this.debug = debug
        this.ip = ip

        this.bots = [];
        this.ByteBuffer = Struct({
            // 64 bit pointer so needs to use the 64 bit interface dll and 64 bit node.exe, hacky but it works.
            // I couldn't get the ptr type to work, I'd rather have the bitness decided by the interpreter.
            'ptr': ref.types.uint64,
            'size': ref.types.uint32
        });

        //gets the path of the python lib from the python server
        this.interfacePath = null

        // this is a dll specific to windows
        this.windows = ffi.Library('msvcrt', {
            'memcpy': [ref.types.void, [ref.types.uint64, ref.types.uint64, ref.types.uint32]] // even more 64 bit pointers
        });

        // Variable for dynamic refresh rate
        this.lastTime = 0.0;

        console.log("Waiting for dll to initialize...");
    }

    newBotClass(botClass) {
        this.botClass = botClass
        this.bots = []
    }

    loadInterface() {
        this.interface = ffi.Library(path.join(this.interfacePath, '/RLBot_Core_Interface'), {
            'IsInitialized': [ref.types.bool, []],
            'UpdateLiveDataPacketFlatbuffer': [this.ByteBuffer, []],
            'UpdatePlayerInputFlatbuffer': [ref.types.int32, [ref.types.uint64, ref.types.uint32]], // also 64 bit pointer
            'Free': [ref.types.void, [ref.types.uint64]], // same here
            'GetBallPrediction': [this.ByteBuffer, []],
            'UpdateFieldInfoFlatbuffer': [this.ByteBuffer, []],
            'SendQuickChat': [ref.types.int32, [ref.types.uint64, ref.types.uint32]],
            'SetGameState': [ref.types.int32, [ref.types.uint64, ref.types.uint32]],
            'RenderGroup': [ref.types.int32, [ref.types.uint64, ref.types.uint32]],
        });



        this.waitUntilInitialized().then(() => {
            console.log("Dll initialized!");
        })
    }
    //so the while loop is non blocking
    async waitUntilInitialized() {
        return new Promise((resolve, reject) => {
            while (!this.interface.IsInitialized()) {

            }
            resolve()
        })
    }
    /**
     * starts the botManager...
     * @param {BaseAgent} botClass Required
     * @param {Number} port Optional, if you pass this in, make sure it matches with the port the python code uses!
     */
    start() {
        var server = net.createServer((socket) => {
            socket.setEncoding('ascii');
            socket.on('data', (data) => {
                var message = data.toString().split('\n');
                if (message[4] != null && this.interfacePath == null) {
                    this.interfacePath = message[4]
                    this.loadInterface()
                }
                switch (message[0]) {
                    case 'add':
                        if (message.length < 4) break;
                        if (this.bots[Number(message[3])] != undefined) return
                        this.bots[Number(message[3])] = new this.botClass(message[1], Number(message[2]), Number(message[3]), this.getFieldInfo());
                        this.bots[Number(message[3])]._manager = this
                        this.bots[Number(message[3])].renderer = new RenderManager(this, Number(message[3]))
                        console.log('Added a bot ' + message[1] + ' with the index ' + message[3]);
                        break;

                    case 'remove':
                        this.bots[Number(message[1])] = null;
                        console.log('Removed a bot with index' + message[1]);
                        break;

                    default:
                        break;
                }
            });
        });

        server.listen(this.port, this.ip, function () {
            var serverInfoJson = JSON.stringify(server.address());
            console.log('TCP server listening on address : ' + serverInfoJson);

            server.on('close', function () {
                console.log('TCP server socket is closed.');
            });

            server.on('error', function (error) {
                console.error(JSON.stringify(error));
            });
        });

        server.on('error', (e) => {
            if(e.code == 'EADDRINUSE') {
                console.log('[NodeJS] Port already in use, if you aren\'t debugging try another port')
            }
        })

        // Start interval (set to 4 cause its a little faster than 240 packets per second)
        setInterval(() => this.updateBots(), 4);
    }

    sendInput(botIndex, botInput) {
        var controller = rlbot.flat.ControllerState;
        var playerinput = rlbot.flat.PlayerInput;

        var builder = new flatbuffers.Builder(0);

        controller.startControllerState(builder);
        controller.addThrottle(builder, botInput.throttle);
        controller.addSteer(builder, botInput.steer);
        controller.addPitch(builder, botInput.pitch);
        controller.addYaw(builder, botInput.yaw);
        controller.addRoll(builder, botInput.roll);
        controller.addBoost(builder, botInput.boost);
        controller.addJump(builder, botInput.jump);
        controller.addHandbrake(builder, botInput.handbrake);
        controller.addUseItem(builder, botInput.useItem)
        var controllerOffset = controller.endControllerState(builder);

        playerinput.startPlayerInput(builder);
        playerinput.addPlayerIndex(builder, botIndex);
        playerinput.addControllerState(builder, controllerOffset);
        var playerinputOffset = playerinput.endPlayerInput(builder);

        builder.finish(playerinputOffset);

        var buffer = Buffer.from(builder.asUint8Array());

        this.interface.UpdatePlayerInputFlatbuffer(ref.address(buffer), buffer.length);
    }

    sendQuickChat(QuickChatSelection, index, teamOnly) {
        let quickChat = rlbot.flat.QuickChat

        let builder = new flatbuffers.Builder(0);

        quickChat.startQuickChat(builder)
        quickChat.addQuickChatSelection(builder, QuickChatSelection)
        quickChat.addPlayerIndex(builder, index)
        quickChat.addTeamOnly(builder, teamOnly)
        let quickchatOffset = quickChat.endQuickChat(builder)

        builder.finish(quickchatOffset)

        let buffer = Buffer.from(builder.asUint8Array())

        this.interface.SendQuickChat(ref.address(buffer), buffer.length)
    }

    setGameState(gameState) {
        let builder = new flatbuffers.Builder(0);
        let gameStateOffset = gameState.convertToFlat(builder)
        builder.finish(gameStateOffset)

        let buffer = Buffer.from(builder.asUint8Array())

        this.interface.SetGameState(ref.address(buffer), buffer.length)
    }

    updateBots() {
        if (this.interface == null) return;
        
        var gameTickPacket;
        var ballPrediction;
        var fieldInfo;
        
        var bytebufferGTP = this.interface.UpdateLiveDataPacketFlatbuffer();

        if (bytebufferGTP.size > 4) {
            let GTPBuffer = Buffer.alloc(bytebufferGTP.size);
            this.windows.memcpy(ref.address(GTPBuffer), bytebufferGTP.ptr, bytebufferGTP.size);
            this.interface.Free(bytebufferGTP.ptr);
            var flatGTPBuffer = new flatbuffers.ByteBuffer(Uint8Array.from(GTPBuffer));
            var flatGameTickPacket = rlbot.flat.GameTickPacket.getRootAsGameTickPacket(flatGTPBuffer);
            gameTickPacket = new GameTickPacket(flatGameTickPacket);

            if (this.lastTime != gameTickPacket.gameInfo.secondsElapsed) {
                let bytebufferBP = this.interface.GetBallPrediction();
                let bytebufferFI = this.interface.UpdateFieldInfoFlatbuffer();

                if (bytebufferBP.size > 4 && bytebufferFI.size > 4) {
                    // Ball prediction
                    let BPBuffer = Buffer.alloc(bytebufferBP.size);
                    this.windows.memcpy(ref.address(BPBuffer), bytebufferBP.ptr, bytebufferBP.size);
                    this.interface.Free(bytebufferBP.ptr);
                    let flatBPBuffer = new flatbuffers.ByteBuffer(Uint8Array.from(BPBuffer));
                    let flatBallPrediction = rlbot.flat.BallPrediction.getRootAsBallPrediction(flatBPBuffer);
                    ballPrediction = new BallPrediction(flatBallPrediction);

                    // Field Info
                    let FIBuffer = Buffer.alloc(bytebufferFI.size);
                    this.windows.memcpy(ref.address(FIBuffer), bytebufferFI.ptr, bytebufferFI.size);
                    this.interface.Free(bytebufferFI.ptr);
                    let flatFIBuffer = new flatbuffers.ByteBuffer(Uint8Array.from(FIBuffer));
                    let flatFieldInfo = rlbot.flat.FieldInfo.getRootAsFieldInfo(flatFIBuffer);
                    fieldInfo = new FieldInfo(flatFieldInfo);
                } else return;
                

                this.lastTime = gameTickPacket.gameInfo.secondsElapsed;
            } else return;
            
        } else return;
        

        for (let i = 0; i < this.bots.length; i++) {
            if (this.bots[i] != null) {
                var _input = new SimpleController()
                if (this.debug) {
                    _input = this.bots[i].getOutput(gameTickPacket, ballPrediction, fieldInfo);
                } else {
                    try {
                        _input = this.bots[i].getOutput(gameTickPacket, ballPrediction, fieldInfo);
                    } catch (e) {
                        console.error(`An error occurred when running a bot with the name of ${this.bots[i].name.toString()}:\n ${e.toString()}`);
                        _input = new SimpleController()
                    }
                }

                if (!_input instanceof SimpleController) {
                    console.error(`The output of ${this.bots[i].name.toString()} wasn't a SimpleController object! The output is now an un-modified SimpleController.`);
                    _input = new SimpleController();
                }

                this.sendInput(i, _input);
            }
        }
    }

    getGameTickPacket() {
        var bytebuffer = this.interface.UpdateLiveDataPacketFlatbuffer();

        let buffer = Buffer.alloc(bytebuffer.size);

        this.windows.memcpy(
            ref.address(buffer),
            bytebuffer.ptr,
            bytebuffer.size);

        this.interface.Free(bytebuffer.ptr);

        var flatbuffer = new flatbuffers.ByteBuffer(Uint8Array.from(buffer));
        var flatGameTickPacket = rlbot.flat.GameTickPacket.getRootAsGameTickPacket(flatbuffer);

        return new GameTickPacket(flatGameTickPacket)
    }

    getBallPrediction() {
        let bytebuffer = this.interface.GetBallPrediction();

        let buffer = Buffer.alloc(bytebuffer.size);

        this.windows.memcpy(
            ref.address(buffer),
            bytebuffer.ptr,
            bytebuffer.size);

        this.interface.Free(bytebuffer.ptr);

        let flatbuffer = new flatbuffers.ByteBuffer(Uint8Array.from(buffer));
        let flatBallPrediction = rlbot.flat.BallPrediction.getRootAsBallPrediction(flatbuffer);

        return new BallPrediction(flatBallPrediction)
    }

    getFieldInfo() {
        let bytebuffer = this.interface.UpdateFieldInfoFlatbuffer();

        let buffer = Buffer.alloc(bytebuffer.size);

        this.windows.memcpy(
            ref.address(buffer),
            bytebuffer.ptr,
            bytebuffer.size);

        this.interface.Free(bytebuffer.ptr);

        let flatbuffer = new flatbuffers.ByteBuffer(Uint8Array.from(buffer));
        let flatFieldInfo = rlbot.flat.FieldInfo.getRootAsFieldInfo(flatbuffer);
        return new FieldInfo(flatFieldInfo)
    }
}

module.exports = BotManager
