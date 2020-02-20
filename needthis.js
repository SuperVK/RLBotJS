const net = require('net')

class JSAgent {
    constructor(port) {
        this.client = net.createConnection({
            port: port
        }, () => {
            console.log('Connected')
            
            this.send([{"type": "Ready", "name": "JSBot", "team": 0, "id": 0, "multiplicity": 1}])
        })
        this.client.on('data', data => {
            try {
                console.log(JSON.parse(data))
            } catch(e) {
                console.log(data.readInt16LE(0))
            }
        })
    }

    send(json) {
        const stringified = JSON.stringify(json)

        const buffer = Buffer.from(stringified);
        const consolidatedBuffer = Buffer.alloc(2 + buffer.length);
        consolidatedBuffer.fill(0)
        

        consolidatedBuffer.writeInt32LE(buffer.length, 0);
        buffer.copy(consolidatedBuffer, 2);
        this.client.write(consolidatedBuffer);
    }
}

const client = new JSAgent(23234)





