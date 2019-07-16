const path = require('path')
const flatbuffers = require('flatbuffers').flatbuffers;
const flat = require(path.join(__dirname, '../../rlbot/rlbot_generated.js')).rlbot.flat;
const { 
    RotatorPartial, 
    DesiredPhysics, 
    DesiredBallState, 
    DesiredCarState, 
    DesiredBoostState, 
    DesiredGameInfoState, 
    DesiredGameState, 
    Float,
    Vector3Partial
} = require(path.join(__dirname, '../../rlbot/rlbot_generated.js')).rlbot.flat;

class Vector3 {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }
    convertToFlat(builder) {
        if(this.x == null && this.y == null && this.z == null) return null
        return flat.Vector3.createVector3(builder, this.x, this.y, this.z)
    } 
    convertToFlatPartial(builder) {
        if(this.x == null && this.y == null && this.z == null) return null
        Vector3Partial.startVector3Partial(builder)
        if(this.x != null) Vector3Partial.addX(builder, Float.createFloat(builder, this.x))
        if(this.y != null) Vector3Partial.addY(builder, Float.createFloat(builder, this.y))
        if(this.z != null) Vector3Partial.addZ(builder, Float.createFloat(builder, this.z))
        return Vector3Partial.endVector3Partial(builder)
    }    
}

class Rotator {
    /**
     * 
     * @param {Number} pitch 
     * @param {Number} yaw 
     * @param {Number} roll 
     */
    constructor(pitch, yaw, roll) {
        this.pitch = pitch
        this.yaw = yaw
        this.roll = roll
    }
    convertToFlat(builder) {
        if(this.pitch == null && this.yaw == null && this.roll == null) return null
        RotatorPartial.startRotatorPartial(builder)
        if(this.pitch != null) RotatorPartial.addPitch(builder, Float.createFloat(builder, this.pitch))
        if(this.yaw != null) RotatorPartial.addYaw(builder, Float.createFloat(builder, this.yaw))
        if(this.roll != null) RotatorPartial.addRoll(builder, Float.createFloat(builder, this.roll))
        return RotatorPartial.endRotatorPartial(builder)
    }
}

class Physics {
    /**
     * 
     * @param {Vector3} location 
     * @param {Rotator} rotation 
     * @param {Vector3} velocity 
     * @param {Vector3} angularVelocity
     */
    constructor(location, rotation, velocity, angularVelocity) {
        this.location = location
        this.rotation = rotation
        this.velocity = velocity
        this.angularVelocity = angularVelocity
    }
    convertToFlat(builder) {
        let locationFlat = this.location ? this.location.convertToFlatPartial(builder) : null
        let rotationFlat = this.rotation ? this.rotation.convertToFlat(builder) : null
        let velocityFlat = this.velocity ? this.velocity.convertToFlatPartial(builder) : null
        let angularVelocityFlat = this.angularVelocity ? this.angularVelocity.convertToFlatPartial(builder) : null
        if(locationFlat == null && rotationFlat == null && velocityFlat == null && angularVelocity == null) return null
        DesiredPhysics.startDesiredPhysics(builder)
        if(locationFlat != null) DesiredPhysics.addLocation(builder, locationFlat)
        if(rotationFlat != null) DesiredPhysics.addRotation(builder, rotationFlat)
        if(velocityFlat != null) DesiredPhysics.addVelocity(builder, velocityFlat)
        if(angularVelocityFlat != null) DesiredPhysics.addAngularVelocity(builder, angularVelocityFlat)
        return DesiredPhysics.endDesiredPhysics(builder)
    }
}

class BallState {
    /**
     * 
     * @param {Physics} physics 
     */
    constructor(physics) {
        this.physics = physics
    }
    convertToFlat(builder) {
        let physicsFlat = this.physics ? this.physics.convertToFlat(builder) : null
        if(physicsFlat == null) return null
        else {
            DesiredBallState.startDesiredBallState(builder)
            DesiredBallState.addPhysics(builder, physicsFlat)
            return DesiredBallState.endDesiredBallState(builder)
        }
    }
}

class CarState {
    /**
     * 
     * @param {Physics} physics 
     * @param {Number} boostAmount 
     * @param {Boolean} jumped 
     * @param {Boolean} doubleJumped 
     */
    constructor(physics, boostAmount, jumped, doubleJumped) {
        this.physics = physics
        this.boostAmount = boostAmount
        this.jumped = jumped
        this.doubleJumped = doubleJumped
    }
    convertToFlat(builder) {
        let physicsFlat = this.physics ? this.physics.convertToFlat(builder) : null
        DesiredCarState.startDesiredCarState(builder)
        if(physicsFlat != null) DesiredCarState.addPhysics(builder, physicsFlat)
        if(this.boostAmount != null) DesiredBallState.addBoostAmount(builder, this.boostAmount)
        if(this.jumped != null) DesiredBallState.addJumped(builder, this.jumped)
        if(this.doubleJumped != null) DesiredBallState.addDoubleJumped(builder, this.doubleJumped)
        return DesiredCarState.endDesiredCarState(builder)
    }
}

class BoostState {
    /**
     * 
     * @param {Number} respawnTime 
     */
    constructor(respawnTime) {
        this.respawnTime = respawnTime
    }
    convertToFlat(builder) {
        DesiredBoostState.startDesiredBoostState(builder)
        if(this.respawnTime != null) DesiredBoostState.addRespawnTime(builder, this.respawnTime)
        return DesiredBoostState.endDesiredBoostState(builder)
    }
}

class GameInfoState {
    /**
     * 
     * @param {Number} worldGravityZ 
     * @param {Number} gameSpeed 
     */
    constructor(worldGravityZ, gameSpeed) {
       this.worldGravityZ = worldGravityZ
       this.gameSpeed = gameSpeed 
    }
    convertToFlat(builder) {
        DesiredGameInfoState.startDesiredGameInfoState(builder)
        if(this.worldGravityZ != null) DesiredGameInfoState.addDesiredGameInfoState(builder, this.worldGravityZ)
        if(this.gameSpeed != null) DesiredGameInfoState.addDesiredGameInfoState(builder, this.gameSpeed)
        return DesiredGameInfoState.endDEsiredGameInfoState(builder)
    }
}

class GameState {
    /**
     * 
     * @param {BallState} ballState 
     * @param {Array<CarState>} carStates 
     * @param {Array<BoostState>} boostStates 
     * @param {GameInfoState} gameInfoState 
     */
    constructor(ballState, carStates, boostStates, gameInfoState) {
        this.ballState = ballState
        this.carStates = carStates
        this.boostStates = boostStates
        this.gameInfoState = gameInfoState
    }
    convertToFlat(builder) {
        if(builder == null) builder = new flatbuffers.Builder(0)
        let ballStateFlat = this.ballState ? this.ballState.convertToFlat(builder) : null
        let carStates = this.carStates ? [] : null
        if(carStates != null) {
            for(let carState of this.carStates) {
                carStates.push(carState ? carState.convertToFlat(builder) : null)
            }
        }
        let carStatesFlat = carStates ? DesiredGameState.createCarStatesVector(builder, carStates): null
        let boostStates = this.boostStates ? [] : null
        if(boostStates != null) {
            for(let boostState of this.boostStates) {
                boostStates.push(boostState ? boostState.convertToFlat(builder) : null)
            }
        }
        let boostStatesFlat = boostStates ? DesiredGameState.createBoostStatesVector(builder, boostStates) : null
        let gameInfoStateFlat = this.gameInfoState ? this.gameInfoState.convertToFlat(builder) : null

        DesiredGameState.startDesiredGameState(builder)
        if(ballStateFlat != null) DesiredGameState.addBallState(builder, ballStateFlat)
        if(carStatesFlat != null) DesiredGameState.addCarStates(builder, carStatesFlat)
        if(boostStatesFlat != null) DesiredGameState.addBoostStates(builder, boostStatesFlat)
        if(gameInfoStateFlat != null) DesiredGameState.addGameInfoState(builder, gameInfoStateFlat)
        return DesiredGameState.endDesiredGameState(builder)
    }
}

module.exports = {
    Vector3: Vector3,
    Rotator: Rotator,
    Physics: Physics,
    BallState: BallState,
    BoostState: BoostState,
    GameInfoState: GameInfoState,
    CarState: CarState,
    GameState: GameState
}
