declare module "rlbot-test" {
    export class Vector3 { 
        x: number;
        y: number;
        z: number;
        constructor(
            x?: number,
            y?: number,
            z?: number,
        )
    }
    export class Rotator {
        pitch: number;
        yaw: number;
        roll: number;
        constructor(
            pitch?: number,
            yaw?: number,
            roll?: number,
        )
    }
    export class Physics {
        location: Vector3;
        rotation: Rotator;
        velocity: Vector3;
        angularVelocity: Vector3;
        constructor(
            location?: Vector3,
            rotation?: Rotator,
            velocity?: Vector3,
            angularVelocity?: Vector3,
        )
    }
    export class BallState {
        physics: Physics
        constructor(physics?: Physics)
    }
    export class CarState {
        physics: Physics;
        boostAmount: number;
        jumped: boolean;
        doubleJumped: boolean;
        constructor(
            physics?: Physics,
            boostAmount?: number,
            jumped?: boolean,
            doubleJumped?: boolean,
        )
    }
    export class BoostState {
        respawnTime: number;
        constructor(
            respawnTime?: number
        )
    }
    export class GameInfoState {
        worldGravityZ: number;
        gameSpeed: number;
        constructor(
            worldGravityZ?: number,
            gameSpeed?: number,
        )
    }
    export class GameState {
        ballState: BallState;
        carState: CarState[];
        boostState: BoostState[];
        gameInfoState: GameInfoState[];
        constructor(
            ballState?: BallState,
            carState?: CarState[],
            boostState?: BoostState[],
            gameInfoState?: GameInfoState[],
        )
    }

    interface BoostPad {
        location: Vector3;
        isFullBoost: boolean;
    }

    interface GoalInfo {
        teamNum: number;
        location: Vector3;
        direction: Vector3;
    }

    interface FieldInfo {
        boostPads: BoostPad[];
        goals: GoalInfo[];
    }

    export class Color {
        alpha: number;
        red: number;
        green: number;
        blue: number;
        constructor(
            alpha: number,
            red: number,
            green: number,
            blue: number,
        )
    }


    class Renderer {
        Color: Color;
        beingRendering(groupID?: number): void;
        endRendering(): void;
        drawString2D(
            x: number,
            y: number,
            scaleX: number,
            scaleY: number,
            text: string,
            color: Color,
        ): void;
        drawString3D(
            vector: Vector3,
            scaleX: number,
            scaleY: number,
            text: string,
            color: Color,
        ): void;
        drawLine3D(
            start: Vector3,
            end: Vector3,
            color: Color
        )
    }

    interface Player {
        physics: Physics;
        scoreInfo: {
            score: number;
            goals: number;
            ownGoals: number;
            assists: number;
            saves: number;
            shots: number;
            demolitions: number;
        };
        isDemolished: boolean;
        hasWheelContact: boolean;
        isSupersonic: boolean;
        isBot: boolean;
        jumped: boolean;
        doubleJumped: boolean;
        name: string;
        boost: number;
    }

    interface BoostPadState {
        isActive: boolean;
        timer: number;
    }

    interface Ball {
        physics: Physics;
        latestTouch: {
            playerName: string;
            gameSeconds: number;
            location: Vector3;
            normal: Vector3;
            team: number;
            playerIndex: number;
        };
        dropShotInfo: {
            absorbedForce: number;
            damageIndex: number;
            forceAccumRecent: number;
        };
    }

    interface GameInfo {
        secondsElapsed: number;
        gameTimeRemaining: number;
        isOvertime: boolean;
        isRoundActive: boolean;
        isKickoffPause: boolean;
        isMatchEnded: boolean;
        worldGravityZ: number;
        gameSpeed: number;
    }

    interface Team {
        teamIndex: number;
        score: number;
    }

    interface GameTickPacket {
        players: Player[],
        boostPadStates: BoostPadState[],
        ball: Ball;
        gameInfo: GameInfo;
        teams: Team[];
    }

    interface Slice {
        gameSeconds: number;
        physics: Physics;
    }

    interface BallPrediction {
        slices: Slice[];
    }

    export class Simplecontroller {
        throttle: number;
        steer: number;
        pitch: number;
        roll: number;
        yaw: number;
        boost: boolean;
        jumped: boolean;
        handbrake: boolean;
        useItem: boolean;
    }

    export enum quickChats {
        information = {
            IGotIt = 0,
            NeedBoost = 1,
            TakeTheShot = 2,
            Defending = 3,
            GoForIt = 4,
            Centering = 5,
            AllYours = 6,
            InPosition = 7,
            Incoming = 8,
            NiceShot = 9,
            GreatPass = 10,
            Thanks = 11,
            WhatASave = 12,
            NiceOne = 13,
            WhatAPlay = 14,
            GreatClear = 15,
            NiceBlock = 16,
        },
        compliments = {
            NiceShot = 9,
            GreatPass = 10,
            Thanks = 11,
            WhatASave = 12,
            NiceOne = 13,
            WhatAPlay = 14,
            GreatClear = 15,
            NiceBlock = 16,
        },
        reactions = {
            OMG = 17,
            Noooo = 18,
            Wow = 19,
            CloseOne = 20,
            NoWay = 21,
            HolyCow = 22,
            Whew = 23,
            Siiiick = 24,
            Calculated = 25,
            Savage = 26,
            Okay = 27,
        },
        apologies = {
            Cursing = 28,
            NoProblem = 29,
            Whoops = 30,
            Sorry = 31,
            MyBad = 32,
            Oops = 33,
            MyFault = 34,
        },
        postGame = {
            Gg = 35,
            WellPlayed = 36,
            ThatWasFun = 37,
            Rematch = 38,
            OneMoreGame = 39,
            WhatAGame = 40,
            NiceMoves = 41,
            EverybodyDance = 42,
        },
        custom = {
            /// Waste of CPU cycles
            Toxic_WasteCPU = 44,
            /// Git gud*
            Toxic_GitGut = 45,
            /// De-Allocate Yourself
            Toxic_DeAlloc = 46,
            /// 404 = Your skill not found
            Toxic_404NoSkill = 47,
            /// Get a virus
            Toxic_CatchVirus = 48,
            /// Passing!
            Useful_Passing = 49,
            /// Faking!
            Useful_Faking = 50,
            /// Demoing!
            Useful_Demoing = 51,
            /// BOOPING
            Useful_Bumping = 52,
            /// The chances of that was 47525 to 1*
            Compliments_TinyChances = 53,
            /// Who upped your skill level?
            Compliments_SkillLevel = 54,
            /// Your programmer should be proud
            Compliments_proud = 55,
            /// You're the GC of Bots
            Compliments_GC = 56,
            /// Are you <Insert Pro>Bot? *
            Compliments_Pro = 57,
        }

    }

    export class BaseAgent {
        name: string;
        team: number;
        index: number;
        fieldInfo: FieldInfo;
        renderer: Renderer;
        getOutput(gameTickPacket: GameTickPacket, ballPrediction: BallPrediction): SimpleController;
        sendQuickChat(QuickChatSelection: quickChats, teamOnly: boolean): void;
        setGameState(gameState: GameState): void;
    }
}