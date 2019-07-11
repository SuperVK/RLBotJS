const Manager = require('./src/BotManager')

module.exports = {
    BaseAgent: require('./src/baseAgent'),
    SimpleController: require('./src/structs/SimpleController'),
    Manager: Manager,
    quickChats: require('./src/structs/quickchats')
}