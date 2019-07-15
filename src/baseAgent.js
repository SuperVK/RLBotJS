class BaseAgent {
    constructor(name, team, index, fieldInfo) {
        this.name = name;
        this.team = team;
        this.index = index;
        this.fieldInfo = fieldInfo
        this._manager = null; //set by the manager
        //console.log('Initializing bot... name:' + this.name + ' team:' + this.team + ' id:' + this.index);

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