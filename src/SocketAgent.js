import net from 'net'
import { EventEmitter } from 'events'

export default class SocketAgent extends EventEmitter {
    constructor(port) {
        this.connection = net.createConnection({
            port: port
        })
        this.connection.on('data', this.incoming.bind(this))
        this.isReading = false // waiting for header
        this.lastHeader = 0
        this.streamingMessage = ''
    }
    incoming(data) {
        if(!this.isReading) {
            this.lastHeader = data.readInt16LE(0)
            this.isReading = true
        } else {
            this.streamingMessage += data.toString()
            if(this.streamingMessage.length == this.lastHeader) {
                this.lastHeader = 0
                this.isReading = false

                const packet = JSON.parse(this.streamingMessage)
                this.emit(packet.toLowerCase(), packet)
            }
        }
    }
}