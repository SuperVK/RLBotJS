class BaseAgent {
    constructor(name, team, index) {
        this.name = name;
        this.team = team;
        this.index = index;
        //console.log('Initializing bot... name:' + this.name + ' team:' + this.team + ' id:' + this.index);
    }

    getOutput(gameTickPacket) {
        throw new Error("Method 'getOutput()' must be implemented.");
    }
}

module.exports = BaseAgent