function Vec3(flat) {
    this.x = flat.x()
    this.y = flat.y() 
    this.z = flat.z()
}

function Rotator(flat) {
    this.pitch = flat.pitch()
    this.yaw = flat.yaw()
    this.roll = flat.roll()
}

function Physics(flat) {
    this.location = new Vec3(flat.location())
    this.rotation = flat.rotation() ? new Rotator(flat.rotation()) : null
    this.velocity = new Vec3(flat.velocity())
    this.angularVelocity = new Vec3(flat.angularVelocity())
}

function Touch(flat) {
    this.playerName = flat.playerName()
    this.gameSeconds = flat.gameSeconds()
    this.location = new Vec3(flat.location())
    this.normal = new Vec3(flat.normal())
    this.team = flat.team()
}

function BallInfo(flat) {
    this.physics = new Physics(flat.physics())
    this.latestTouch = flat.latestTouch() ? new Touch(flat.latestTouch()) : null
}

function GameInfo(flat) {
    this.secondsElapsed = flat.secondsElapsed()
    this.gameTimeRemaining = flat.gameTimeRemaining()
    this.isOvertime = flat.isOvertime()
    this.isRoundActive = flat.isRoundActive()
    this.isKickoffPause = flat.isKickoffPause()
    this.isMatchEnded = flat.isMatchEnded()
    this.worldGravityZ = flat.worldGravityZ()
    this.gameSpeed = flat.gameSpeed()
}

function ScoreInfo(flat) {
    this.score = flat.score()
    this.goals = flat.goals()
    this.ownGoals = flat.ownGoals()
    this.assists = flat.assists()
    this.saves = flat.saves()
    this.shots = flat.shots()
    this.demolitions = flat.demolitions()
}

function PlayerInfo(flat) {
    this.physics = new Physics(flat.physics())
    this.scoreInfo = new ScoreInfo(flat.scoreInfo())
    this.isDemolished = flat.isDemolished()
    this.hasWheelContact = flat.hasWheelContact()
    this.isSupersonic = flat.isSupersonic()
    this.isBot = flat.isBot()
    this.jumped = flat.jumped()
    this.doubleJumped = flat.doubleJumped()
    this.name = flat.name()
    this.boost = flat.boost()
}

function BoostPadState(flat) {
    this.isActive = flat.isActive()
    this.timer = flat.timer()
} 

function TeamInfo(flat) {
    this.teamIndex = flat.teamIndex()
    this.score = flat.score()
}

function GameTickPacket(flat) {
    this.players = []
    for(let p = 0; p < flat.playersLength(); p++) {
        this.players.push(new PlayerInfo(flat.players(p)))
    }
    this.boostPadStates = []
    for(let b = 0; b < flat.boostPadStatesLength(); b++) {
        this.boostPadStates.push(new BoostPadState(flat.boostPadStates(b)))
    }
    this.ball = new BallInfo(flat.ball())
    this.gameInfo = new GameInfo(flat.gameInfo())
    //TODO: tileInformation
    this.teams = []
    for(let t = 0; t < flat.teamsLength(); t++) {
        this.teams.push(new TeamInfo(flat.teams(t)))
    }
}

function PredictionSlice(flat) {
    this.gameSeconds = flat.gameSeconds()
    this.physics = new Physics(flat.physics())
}

function BallPrediction(flat) {
    this.slices = []
    for(let s = 0; s < flat.slicesLength(); s++) {
        this.slices.push(new PredictionSlice(flat.slices(s)))
    }
}

module.exports = {
    Vec3: Vec3,
    Rotator: Rotator,
    Physics: Physics,
    Touch: Touch,
    BallInfo: BallInfo,
    GameInfo: GameInfo,
    PlayerInfo: PlayerInfo,
    BoostPadState: BoostPadState,
    TeamInfo: TeamInfo,
    GameTickPacket: GameTickPacket,
    BallPrediction: BallPrediction
}