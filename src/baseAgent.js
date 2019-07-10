var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');
const path = require('path')
const { BallPrediction } = require('./structs/flatstructs')

var flatbuffers = require('flatbuffers').flatbuffers;

var rlbot = require(path.join(__dirname, '../rlbot/rlbot_generated.js')).rlbot;


const byteBuffer = Struct({
    // 64 bit pointer so needs to use the 64 bit interface dll and 64 bit node.exe, hacky but it works.
    // I couldn't get the ptr type to work, I'd rather have the bitness decided by the interpreter.
    'ptr': ref.types.uint64,
    'size': ref.types.uint32
});

class BaseAgent {
    constructor(name, team, index) {
        this.name = name;
        this.team = team;
        this.index = index;
        //console.log('Initializing bot... name:' + this.name + ' team:' + this.team + ' id:' + this.index);

        this.interface = ffi.Library(path.join(__dirname, '../rlbot/RLBot_Core_Interface'), {
            'GetBallPrediction': [byteBuffer, []],
            'Free': [ref.types.void, [ref.types.uint64]]
        })

        this.windows = ffi.Library('msvcrt', {
            'memcpy': [ref.types.void, [ref.types.uint64, ref.types.uint64, ref.types.uint32]] // even more 64 bit pointers
        });

    }

    getOutput(gameTickPacket) {
        throw new Error("Method 'getOutput()' must be implemented.");
    }

    getBallPrediction() {
        let bytebuffer = this.interface.GetBallPrediction();

        let buffer = new Buffer(bytebuffer.size);

        this.windows.memcpy(
            ref.address(buffer),
            bytebuffer.ptr,
            bytebuffer.size);

        this.interface.Free(bytebuffer.ptr);

        let flatbuffer = new flatbuffers.ByteBuffer(Uint8Array.from(buffer));
        let flatBallPrediction = rlbot.flat.BallPrediction.getRootAsBallPrediction(flatbuffer);

        return new BallPrediction(flatBallPrediction)
    }
}

module.exports = BaseAgent