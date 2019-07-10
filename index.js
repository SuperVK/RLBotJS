const Manager = require('./src/BotManager')

module.exports = {
    BaseAgent: require('./src/baseAgent'),
    SimpleController: {
        throttle: 0,
        steer: 0,
        pitch: 0,
        roll: 0,
        yaw: 0,
        boost: false,
        jump: false,
        handbrake: false
    },
    Manager: Manager
}