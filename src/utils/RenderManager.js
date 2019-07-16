const crypto = require('crypto')
const flatbuffers = require('flatbuffers').flatbuffers
const path = require('path')
const ref = require('ref')
const { RenderMessage, RenderType, RenderGroup } = require(path.join(__dirname, '../../rlbot/rlbot_generated.js')).rlbot.flat;
const flat = require(path.join(__dirname, '../../rlbot/rlbot_generated.js')).rlbot.flat
const { Vector3 } = require('./GameState')
const defaultGroupId = 'default'
const maxInt = 1337

class Color {
    /**
     * 
     * @param {Number} alpha 
     * @param {Number} red 
     * @param {Number} green 
     * @param {Number} blue 
     */
    constructor(alpha, red, green, blue) {
        this.alpha = alpha
        this.red = red
        this.green = green
        this.blue = blue
    }
    convertToFlat(builder) {
        flat.Color.startColor(builder)
        flat.Color.addA(builder, this.alpha)
        flat.Color.addR(builder, this.red)
        flat.Color.addG(builder, this.green)
        flat.Color.addB(builder, this.blue)
        return flat.Color.endColor(builder)
    }
}

class RenderManager {
    constructor(botManager, index) {
        this.manager = botManager
        this.builder = null
        this.index = index
        this.Color = Color
        this.renderList = []
        this.groupID = ''
    }
    /**
     * 
     * @param {String} [groupID]
     */
    beginRendering(groupID) {
        this.builder = new flatbuffers.Builder(0)
        this.renderList = []
        if(groupID) this.groupID = groupID
    }

    endRendering() {
        if(this.groupID == undefined) this.groupID = 'default'
        const hash = crypto.createHash('sha256')
        hash.update(this.groupID + this.index)
        let groupIDHashed = parseInt(hash.digest('hex'), 16)%maxInt
        
        let messages = RenderGroup.createRenderMessagesVector(this.builder, this.renderList)

        RenderGroup.startRenderGroup(this.builder)
        RenderGroup.addId(this.builder, groupIDHashed)
        RenderGroup.addRenderMessages(this.builder, messages)

        let result = RenderGroup.endRenderGroup(this.builder)

        this.builder.finish(result)

        let buffer = Buffer.from(this.builder.asUint8Array())

        this.manager.interface.RenderGroup(ref.address(buffer), buffer.length)
    }
    /**
     * 
     * @param {Number} x
     * @param {Number} y
     * @param {Number} scaleX
     * @param {Number} scaleY 
     * @param {String} text 
     * @param {Color} color 
     */
    drawString2D(x, y, scaleX, scaleY, text, color) {
        let textFlat = this.builder.createString(text)
        let colorFlat = color.convertToFlat(this.builder)

        RenderMessage.startRenderMessage(this.builder)
        RenderMessage.addRenderType(this.builder, RenderType.DrawString2D)
        RenderMessage.addColor(this.builder, colorFlat)
        RenderMessage.addStart(this.builder, flat.Vector3.createVector3(this.builder, x, y))
        RenderMessage.addScaleX(this.builder, scaleX)
        RenderMessage.addScaleY(this.builder, scaleY)
        RenderMessage.addText(this.builder, textFlat)

        this.renderList.push(RenderMessage.endRenderMessage(this.builder))
    }
    /**
     * 
     * @param {Vector3} vector 
     * @param {Number} scaleX 
     * @param {Number} scaleY 
     * @param {String} text 
     * @param {Color} color 
     */
    drawString3D(vector, scaleX, scaleY, text, color) {
        let textFlat = this.builder.createString(text)
        let colorFlat = color.convertToFlat(this.builder)

        RenderMessage.startRenderMessage(this.builder)
        RenderMessage.addRenderType(this.builder, RenderType.DrawString3D)
        RenderMessage.addColor(this.builder, colorFlat)
        RenderMessage.addStart(this.builder, vector.convertToFlat(this.builder))
        RenderMessage.addScaleX(this.builder, scaleX)
        RenderMessage.addScaleY(this.builder, scaleY)
        RenderMessage.addText(this.builder, textFlat)

        this.renderList.push(RenderMessage.endRenderMessage(this.builder))
    }
    /**
     * 
     * @param {Number} x
     * @param {Number} y
     * @param {Vector3} end 
     * @param {Color} color 
     */
    drawLine2D_3D(x, y, end, color) {
        let colorFlat = color.convertToFlat(this.builder)
        RenderMessage.startRenderMessage(this.builder)
        RenderMessage.addRenderType(this.builder, RenderType.DrawLine2D_3D)
        RenderMessage.addStart(this.builder, flat.Vector3.createVector3(this.builder, x, y))
        RenderMessage.addEnd(this.builder, end.convertToFlat(this.builder))
        RenderMessage.addColor(this.builder, colorFlat)
        this.renderList.push(RenderMessage.endRenderMessage(this.builder))
    }
    /**
     * 
     * @param {Vector3} start 
     * @param {Vector3} end 
     * @param {Color} color 
     */
    drawLine3D(start, end, color) {
        let colorFlat = color.convertToFlat(this.builder)
        RenderMessage.startRenderMessage(this.builder)
        RenderMessage.addRenderType(this.builder, RenderType.DrawLine3D)
        RenderMessage.addStart(this.builder, start.convertToFlat(this.builder))
        RenderMessage.addEnd(this.builder, end.convertToFlat(this.builder))
        RenderMessage.addColor(this.builder, colorFlat)
        this.renderList.push(RenderMessage.endRenderMessage(this.builder))
    }
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Boolean} filled 
     * @param {Color} color 
     */
    drawRect2D(x, y, width, height, filled, color) {
        let colorFlat = color.convertToFlat(this.builder)
        RenderMessage.startRenderMessage(this.builder)
        RenderMessage.addRenderType(this.builder, RenderType.DrawRect2D)
        RenderMessage.addStart(this.builder, flat.Vector3.createVector3(this.builder, this.x, this.y))
        RenderMessage.addScaleX(this.builder, width)
        RenderMessage.addScaleY(this.builder, height)
        RenderMessage.addIsFilled(this.builder, filled)
        RenderMessage.addColor(this.builder, colorFlat)
        this.renderList.push(RenderMessage.endRenderMessage(this.builder))
    }
    /**
     * 
     * @param {Vector3} vector 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Boolean} filled 
     * @param {Color} color 
     * @param {Boolean} [centered]
     */
    drawRect3D(vector, width, height, filled, color, centered) {
        let colorFlat = color.convertToFlat(this.builder)
        RenderMessage.startRenderMessage(this.builder)
        RenderMessage.addRenderType(this.builder, centered ? RenderType.DrawCenteredRect3D : RenderType.DrawRect3D)
        RenderMessage.addStart(this.builder, vector.convertToFlat(this.builder))
        RenderMessage.addScaleX(this.builder, width)
        RenderMessage.addScaleY(this.builder, height)
        RenderMessage.addIsFilled(this.builder, filled)
        RenderMessage.addColor(this.builder, colorFlat)
        this.renderList.push(RenderMessage.endRenderMessage(this.builder))
    }

    
}

module.exports = RenderManager