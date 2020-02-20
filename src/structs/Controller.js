class Controller {
    constructor(settings) {
        this.controllerObject = Object.assign({
            steer: 0,
            throttle: 0,
            roll: 0,
            pitch: 0,
            yaw: 0,
            boost: 0,
            useItem: 0,
            handbrake: 0
        }, settings)
    }
    toJSON() {
        return JSON.stringify({
            steer: this.controllerObject.steer,
            throttle: this.controllerObject.throttle,
            roll: this.controllerObject.roll,
            pitch: this.controllerObject.pitch,
            yaw: this.controllerObject.yaw,
            boost: this.controllerObject.boost,
            use_item: this.controllerObject.useItem,
            handbrake: this.controllerObject.handbrake
        })
    }
}