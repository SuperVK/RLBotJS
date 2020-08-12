const GameStateUtil = require('./src/utils/GameState')

module.exports = {
    BaseAgent: require('./src/BaseAgent'),
    SimpleController: require('./src/utils/SimpleController'),
    Manager: require('./src/BotManager'),
    quickChats: require('./src/utils/quickchats'),
    GameStateUtil: GameStateUtil,
    Color: require('./src/utils/RenderManager').Color,
    Vector3: GameStateUtil.Vector3,
    Rotator: GameStateUtil.Rotator,
    Physics: GameStateUtil.Physics,
    BallState: GameStateUtil.BallState,
    BoostState: GameStateUtil.BoostState,
    GameInfoState: GameStateUtil.GameInfoState,
    CarState: GameStateUtil.CarState,
    GameState: GameStateUtil.GameState
}
