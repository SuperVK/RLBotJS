const RenderManager = require('./utils/renderManager')

/**
 * 
 * @prop {String} name
 * @prop {Number} team
 * @prop {Number} index
 * @prop {Object} fieldInfo
 * @prop {RenderManager} renderer 
 */
class BaseAgent {
    constructor(name, team, index, fieldInfo) {
        this.name = name;
        this.team = team;
        this.index = index;
        this.fieldInfo = fieldInfo
        this._manager = null; //set by the manager
        this.renderer = null //set by the manager

    }

    //should be overwritten
    getOutput(gameTickPacket, ballPrediction) {
        throw new Error("Method 'getOutput()' must be implemented.");
    }

    //shouldn't be overwritten
    sendQuickChat(QuickChatSelection, teamOnly) {
        this._manager.sendQuickChat(QuickChatSelection, this.index, teamOnly)
    }

    //shouldn't be overwritten
    setGameState(gameState) {
        this._manager.setGameState(gameState)
    }
    
}

module.exports = BaseAgent