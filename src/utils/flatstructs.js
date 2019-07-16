function Vector3(flat) {
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
    this.location = new Vector3(flat.location())
    this.rotation = flat.rotation() ? new Rotator(flat.rotation()) : null
    this.velocity = new Vector3(flat.velocity())
    this.angularVelocity = new Vector3(flat.angularVelocity())
}

function Touch(flat) {
    this.playerName = flat.playerName()
    this.gameSeconds = flat.gameSeconds()
    this.location = new Vector3(flat.location())
    this.normal = new Vector3(flat.normal())
    this.team = flat.team()
    this.playerIndex = flat.playerIndex()
}

function DropShotBallInfo(flat) {
    this.absorbedForce = flat.absorbedForce()
    this.damageIndex = flat.damageIndex()
    this.forceAccumRecent = flat.forceAccumRecent()
}

function BallInfo(flat) {
    this.physics = new Physics(flat.physics())
    this.latestTouch = flat.latestTouch() ? new Touch(flat.latestTouch()) : null
    this.dropShotInfo = new DropShotBallInfo(flat.dropShotInfo())
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

function DropshotTile(flat) {
    this.tileState = flat.tileState()
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
    this.ball = flat.ball() ? new BallInfo(flat.ball()) : null
    this.gameInfo = new GameInfo(flat.gameInfo(flat.gameInfo()))
    this.tileInformation = []
    for(let t = 0; t < flat.tileInformationLength(); t++) {
        this.tileInformation.push(new DropshotTile(flat.tileInformation(t)))
    }
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

function BoostPad(flat) {
    this.location = new Vector3(flat.location())
    this.isFullBoost = flat.isFullBoost()
}

function GoalInfo(flat) {
    this.teamNum = flat.teamNum()
    this.location = new Vector3(flat.location())
    this.direction = new Vector3(flat.direction())
}

function FieldInfo(flat) {
    this.boostPads = []
    for(let b = 0; b < flat.boostPadsLength(); b++) {
        this.boostPads.push(new BoostPad(flat.boostPads(b)))
    }
    this.goals = []
    for(let g = 0; g < flat.goalsLength(); g++) {
        this.goals.push(new GoalInfo(flat.goals(g)))
    }
}

module.exports = {
    Vector3: Vector3,
    Rotator: Rotator,
    Physics: Physics,
    Touch: Touch,
    BallInfo: BallInfo,
    GameInfo: GameInfo,
    PlayerInfo: PlayerInfo,
    BoostPadState: BoostPadState,
    TeamInfo: TeamInfo,
    GameTickPacket: GameTickPacket,
    BallPrediction: BallPrediction,
    BoostPad: BoostPad,
    GoalInfo: GoalInfo,
    FieldInfo: FieldInfo
}