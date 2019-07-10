var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');
const path = require('path')

var flatbuffers = require('flatbuffers').flatbuffers;
const net = require('net');

var rlbot = require(path.join(__dirname, '/rlbot/rlbot_generated.js')).rlbot;

rlbot.BaseAgent = class {
    constructor(name, team, index) {
        this.name = name;
        this.team = team;
        this.index = index;
        console.log('Initializing bot... name:' + this.name + ' team:' + this.team + ' id:' + this.index);
    }

    getOutput(gameTickPacket) {
        throw new Error("Method 'getOutput()' must be implemented.");
    }
}

rlbot.SimpleController = {
    throttle: 0,
    steer: 0,
    pitch: 0,
    roll: 0,
    yaw: 0,
    boost: false,
    jump: false,
    handbrake: false
}

rlbot.Manager = class {
    constructor(port, botClass, ip = '127.0.0.1') {
        this.port = port;
        this.botClass = botClass;
        this.ip = ip;
        this.bots = [];
        this.ByteBuffer = Struct({
            // 64 bit pointer so needs to use the 64 bit interface dll and 64 bit node.exe, hacky but it works.
            // I couldn't get the ptr type to work, I'd rather have the bitness decided by the interpreter.
            'ptr': ref.types.uint64,
            'size': ref.types.uint32
        });

        this.interface = ffi.Library(path.join(__dirname, '/rlbot/RLBot_Core_Interface'), {
            'IsInitialized': [ref.types.bool, []],
            'UpdateLiveDataPacketFlatbuffer': [this.ByteBuffer, []],
            'UpdatePlayerInputFlatbuffer': [ref.types.int32, [ref.types.uint64, ref.types.uint32]], // also 64 bit pointer
            'Free': [ref.types.void, [ref.types.uint64]], // same here
        });

        // this is a dll specific to windows
        this.windows = ffi.Library('msvcrt', {
            'memcpy': [ref.types.void, [ref.types.uint64, ref.types.uint64, ref.types.uint32]] // even more 64 bit pointers
        });

        console.log("Waiting for dll to initialize...");

        while (!this.interface.IsInitialized()) {

        }

        console.log("Dll initialized!");
    }

    start() {
        var server = net.createServer((socket) => {
            socket.setEncoding('ascii');
            socket.on('data', (data) => {
                var message = data.toString().split('\n');
                switch (message[0]) {
                    case 'add':
                        if (message.length < 4) break;
                        this.bots[Number(message[3])] = new this.botClass(message[1], Number(message[2]), Number(message[3]));
                        console.log(message.join(','));
                        break;

                    case 'remove':
                        this.bots[Number(message[1])] = null;
                        console.log(message.join(','));
                        break;

                    default:
                        break;
                }
            });
        });

        server.listen(this.port, this.ip, function () {
            var serverInfoJson = JSON.stringify(server.address());
            console.log('TCP server listen on address : ' + serverInfoJson);

            server.on('close', function () {
                console.log('TCP server socket is closed.');
            });

            server.on('error', function (error) {
                console.error(JSON.stringify(error));
            });
        });

        // start interval
        setInterval(() => this.updateBots(), 1000 / 60);
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
        var controllerOffset = controller.endControllerState(builder);

        playerinput.startPlayerInput(builder);
        playerinput.addPlayerIndex(builder, botIndex);
        playerinput.addControllerState(builder, controllerOffset);
        var playerinputOffset = playerinput.endPlayerInput(builder);

        builder.finish(playerinputOffset);

        var buffer = Buffer.from(builder.asUint8Array());

        this.interface.UpdatePlayerInputFlatbuffer(ref.address(buffer), buffer.length);
    }

    updateBots() {
        var bytebuffer = this.interface.UpdateLiveDataPacketFlatbuffer();

        var buffer = new Buffer(bytebuffer.size);

        this.windows.memcpy(
            ref.address(buffer),
            bytebuffer.ptr,
            bytebuffer.size);

        this.interface.Free(bytebuffer.ptr);

        var flatbuffer = new flatbuffers.ByteBuffer(Uint8Array.from(buffer));
        var gameTickPacket = rlbot.flat.GameTickPacket.getRootAsGameTickPacket(flatbuffer);

        for (let i = 0; i < this.bots.length; i++) {
            if (this.bots[i] != null) {
                var _input = this.bots[i].getOutput(gameTickPacket);
                this.sendInput(i, _input);
            }
        }
    }
}
module.exports = rlbot;