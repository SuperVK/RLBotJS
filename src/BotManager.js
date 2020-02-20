import SocketAgent from './SocketAgent'

export default class BotManager {
    constructor(botClass, debug = false, port = 23234) {
        this.botClass = botClass
        this.socket = new SocketAgent(port)
        this.bots = []


        this.socket.on('initialize', packet => {
            console.log(packet)
        })
        this.socket.on('update', packet => {
            console.log('got updated')
        })
    }

}