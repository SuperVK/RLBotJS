class BaseAgent {
    constructor(name, team, index, _manager) {
        this.name = name;
        this.team = team;
        this.index = index;
        this._manager = _manager
        //console.log('Initializing bot... name:' + this.name + ' team:' + this.team + ' id:' + this.index);

    }

    //should be overwritten
    getOutput(gameTickPacket, ballPrediction, fieldInfo) {
        throw new Error("Method 'getOutput()' must be implemented.");
    }

    //shouldn't be overwritten
    sendQuickChat(QuickChatSelection, teamOnly) {
        this._manager.sendQuickChat(QuickChatSelection, this.index, teamOnly)
    }
    
}

module.exports = BaseAgent