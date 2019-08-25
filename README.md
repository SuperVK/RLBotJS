# RLBot JavaScript Documentation

**Table of Contents** _generated with_ [Doctoc](https://github.com/thlorenz/doctoc)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Links](#links)
- [Bot Making](#bot-making)
  - [Starting a JavaScript Bot](#starting-a-javascript-bot)
- [API Reference](#api-reference)
  - [BaseAgent(*name*, *team*, *index*)](#baseagentname-team-index)
    - [.getOutput(*gameTickPacket*, *ballPrediction*) -> SimpleController](#getoutputgametickpacket-ballprediction---simplecontroller)
    - [.sendQuickChat(*quickChatSelection*, *teamOnly*)](#sendquickchatquickchatselection-teamonly)
    - [.setGameState(*GameState*)](#setgamestategamestate)
  - [GameState](#gamestate)
    - [new GameState(*ballState*: BallState, *carState*: Array<CarState>, *boostState*: Array<BoostState>, *gameInfoState*: GameInfoState)](#new-gamestateballstate-ballstate-carstate-arraycarstate-booststate-arraybooststate-gameinfostate-gameinfostate)
    - [new GameInfoState(*worldGravityZ*: Number, *gameSpeed*: Number)](#new-gameinfostateworldgravityz-number-gamespeed-number)
    - [new BoostState(*respawnTime*: Number)](#new-booststaterespawntime-number)
    - [new CarState(*physics*: Physics, *boostAmount*: Number, *jumped*: Boolean, doubleJumped: Boolean)](#new-carstatephysics-physics-boostamount-number-jumped-boolean-doublejumped-boolean)
    - [new BallState(*physics*: Physics)](#new-ballstatephysics-physics)
    - [new Physics(*location*: Vector3, *rotation*: Rotator, *velocity*: Vector3, *angularVelocity*: Vector3)](#new-physicslocation-vector3-rotation-rotator-velocity-vector3-angularvelocity-vector3)
    - [new Rotator(*pitch*: Number, *yaw*: Number, *roll*, Number)](#new-rotatorpitch-number-yaw-number-roll-number)
    - [new Vector3(*x*: Number, *y*: Number, *z*: Number)](#new-vector3x-number-y-number-z-number)
  - [Game data objects](#game-data-objects)
    - [SimpleController](#simplecontroller)
    - [gameTickPacket](#gametickpacket)
    - [ballPrediction](#ballprediction)
    - [quickChats](#quickchats)
- [Setting up a development environment](#setting-up-a-development-environment)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Links

-   [RLBot](https://github.com/rlbot/rlbot)
-   [RLBotJS](https://github.com/supervk/rlbotjs)
-   [RLBot JavaScript Example](https://github.com/supervk/rlbotjavascriptexample)

## Bot Making

### Starting a JavaScript Bot

The first thing you'll want to do is start a class that extends the `rlbot.BaseAgent` class. This allows you to easily accomplish things that are harder without extending the `BaseAgent`, like sending quick chats. You'll also need to make a new `Manager` that has a parameter of the class extending `BaseAgent`.

Example:

```js
const { BaseAgent, SimpleController, Manager } = require("rlbot-test");

class MyBot extends BaseAgent {
    constructor(name, team, index, fieldInfo) {
        super(name, team, index); // pushes these all to `this`.
        console.log(this.name); // Print our name to the console,  e.g. "MyBot"
    }

    getOutput(gameTickPacket, ballPrediction, fieldInfo) {
        return SimpleController(); // Do nothing in-game
    }
}

const manager = new Manager(MyBot); // This makes a manager
manager.start(); // This starts the manager
```

## API Reference

### BaseAgent(*name*, *team*, *index*)

You shouldn't be calling `new BaseAgent`, instead you should extend it! See the [example](#Starting%20a%20JavaScript%20Bot) 

#### .getOutput(*gameTickPacket*, *ballPrediction*) -> SimpleController

Once again you shouldn't be calling this function, you should be implementing this function!

- gameTickPacket: The object containing all the current field data, see [gameTickPacket](#gameTickPacket)

- ballPrediction: The object containing all the future positions of the ball, calculated using [Chip's notes](https://samuelpmish.github.io/notes/RocketLeague/), see [ballPrediction](#ballPrediction) for the structure

- Return a [SimpleController](#SimpleController)

#### .sendQuickChat(*quickChatSelection*, *teamOnly*)

- quickChatSelection: See [quickChats](#quickChats)
- teamOnly: A boolean, determines if the quickChat should be visible to the team only or not

Example: 
```js
//top of the file
const { quickChats } = require('rlbot-test')

//inside your bot class
this.sendQuickChat(quickChats.compliments.NiceShot, false)
```


#### .setGameState(*GameState*)

This allows to set the state of the game

- GameState: a new GameState, see [GameState](#GameState) for refrence

Example:

```js
let physics = new Physics(null, null, new Vector3(null, null, gameTickPacket.ball.physics.velocity.z+(650/60))) //assumes you are running 60fps
let ball = new BallState(physics) 
this.setGameState(new GameState(ball))
```

### GameState

#### new GameState(*ballState*: [BallState](#BallState), *carState*: Array<[CarState](#CarState)>, *boostState*: Array<[BoostState](#BoostState)>, *gameInfoState*: [GameInfoState](#GameInfoState))

#### new GameInfoState(*worldGravityZ*: Number, *gameSpeed*: Number)

#### new BoostState(*respawnTime*: Number)

#### new CarState(*physics*: [Physics](#Physics), *boostAmount*: Number, *jumped*: Boolean, doubleJumped: Boolean)

#### new BallState(*physics*: [Physics](#Physics))

#### new Physics(*location*: [Vector3](#Vector3), *rotation*: [Rotator](#Rotator), *velocity*: [Vector3](#Vector3), *angularVelocity*: [Vector3](#Vector3))

#### new Rotator(*pitch*: Number, *yaw*: Number, *roll*, Number)

#### new Vector3(*x*: Number, *y*: Number, *z*: Number)

### Game data objects

#### SimpleController

```
{
  throttle:float; /// -1 for full reverse, 1 for full forward
  steer:float; /// -1 for full left, 1 for full right
  pitch:float; /// -1 for nose down, 1 for nose up
  yaw:float; /// -1 for full left, 1 for full right
  roll:float; /// -1 for roll left, 1 for roll right
  jump:bool; /// true if you want to press the jump button
  boost:bool; /// true if you want to press the boost button
  handbrake:bool; /// true if you want to press the handbrake button
  useItem:bool; /// true if you want to use a rumble item
}
```


-   `throttle`: Default is `0`. To go forward, change this to `1`. To go backwards, change this to `-1`. Setting this to `0` will stop the throttle. **NOTE**: Setting this to `0` does not slow the car down very well. If you want to brake, change the throttle to the opposite from what it was. E.g. when this is set to `1`, set this to `-1` until the bot has slowed down.
-   `steer`: Default is `0`. To steer right, change this to `1`. To steer left, change this to `-1`. Setting this to `0` will steer forwards.
-   `pitch`: Default is `0`. To tip the bot forwards, change this to `-1`. To tip the bot backwards, change this to `1`. **NOTE**: Changing this is a way to dodge.
-   `roll`: Default is `0`. To roll clockwise(relative to the back of the car), change this to `-1`. To roll anti-clockwise(relative to the back of the car), change this to `1`. **NOTE**: Changing this is a way to dodge.
-   `yaw`: Default is `0`. To rotate the bot clockwise(relative to the top of the car), change this to `-1`. To rotate the bot clockwise(relative to the top of the car), change this to `1`. **NOTE**: Changing this is a way to dodge.
-   `boost`: Default is `false`. To use boost, change this to `true`. To not use boost, change this to `false`.
-   `jump`: Default is `false`. To jump, change this to `true`. To not jump, change this to `false`
-   `handbrake`: Default is `false`. To powerslide, change this to `true`. To not powerslide, change this to `false`.
-   `useItem`: Default is `false`. To use a rumble item, change this to `true`. To not use a rumble item, change this to `false`.

#### gameTickPacket

```js
{
  "players": [
    {
      "physics": {
        "location": {
          "x": -256,
          "y": -3840,
          "z": 17.010000228881836
        },
        "rotation": {
          "pitch": -0.009587380103766918,
          "yaw": 1.5707963705062866,
          "roll": 0
        },
        "velocity": {
          "x": 0,
          "y": 0.010999999940395355,
          "z": 0.210999995470047
        },
        "angularVelocity": {
          "x": -0.0006099999882280827,
          "y": 0,
          "z": 0
        }
      },
      "scoreInfo": {
        "score": 0,
        "goals": 0,
        "ownGoals": 0,
        "assists": 0,
        "saves": 0,
        "shots": 0,
        "demolitions": 0
      },
      "isDemolished": false,
      "hasWheelContact": true,
      "isSupersonic": false,
      "isBot": true,
      "jumped": false,
      "doubleJumped": false,
      "name": "Bot",
      "boost": 34
    },
    [...] // Order based on index
  ],
  "boostPadStates": [
    {
      "isActive": true,
      "timer": 0
    },
    {
      "isActive": true,
      "timer": 0
    },
    [...] // Order can be found at the useful game values
  ],
  "ball": {
    "physics": {
      "location": {
        "x": -863.6399536132812,
        "y": 281.4499816894531,
        "z": 93.13999938964844
      },
      "rotation": {
        "pitch": 0.18158496916294098,
        "yaw": 0.04918326064944267,
        "roll": 0.06778277456760406
      },
      "velocity": {
        "x": -567.2109375,
        "y": 179.26100158691406,
        "z": 0
      },
      "angularVelocity": {
        "x": -1.809209942817688,
        "y": -5.720609664916992,
        "z": 0.011809999123215675
      }
    },
    "latestTouch": {
      "playerName": "SuperVK",
      "gameSeconds": 405.3416748046875,
      "location": {
        "x": -193.3159637451172,
        "y": 64.18572998046875,
        "z": 92.49647521972656
      },
      "normal": {
        "x": -0.9340062141418457,
        "y": 0.35719090700149536,
        "z": 0.006852129008620977
      },
      "team": 1,
      "playerIndex": 2
    },
    "dropShotInfo": {
      "absorbedForce": 0,
      "damageIndex": 0,
      "forceAccumRecent": 0
    }
  },
  "gameInfo": {
    "secondsElapsed": 406.2083435058594,
    "gameTimeRemaining": -396.08331298828125,
    "isOvertime": false,
    "isRoundActive": true,
    "isKickoffPause": false,
    "isMatchEnded": false,
    "worldGravityZ": -650,
    "gameSpeed": 0
  },
  "tileInformation": [], //for Dropshot
  "teams": [
    {
      "teamIndex": 0,
      "score": 0
    },
    {
      "teamIndex": 1,
      "score": 0
    }
  ]
}
```

#### ballPrediction

```js
{
    "slices": [
        {
            "gameSeconds": 406.2083435058594,
            "physics": {
                "location": {
                    "x": -863.6399536132812,
                    "y": 281.4499816894531,
                    "z": 93.13999938964844
                },
                "rotation": null, // Ball prediction doesn't have rotation
                "velocity": {
                    "x": -567.2109375,
                    "y": 179.26100158691406,
                    "z": 0
                },
                "angularVelocity": {
                    "x": -1.809209942817688,
                    "y": -5.720609664916992,
                    "z": 0.011809999123215675
                }
            }
        },
        [...] // One slice represents one frame
    ]
}
```

#### quickChats

-   `information`
    -   `IGotIt`: `0` - I got it!
    -   `NeedBoost`: `1` - Need boost!
    -   `TakeTheShot`: `2` - Take the shot!
    -   `Defending`: `3` - Defending!
    -   `GoForIt`: `4` - Gor for it!
    -   `Centering`: `5` - Centering!
    -   `AllYours`: `6` - All yours!
    -   `InPosition`: `7` - In position!
    -   `Incoming`: `8` - Incoming!
    -   `NiceShot`: `9` - Nice shot!
    -   `GreatPass`: `10` - Great pass!
    -   `Thanks`: `11` - Thanks!
    -   `WhatASave`: `12` - What a save!
    -   `NiceOne`: `13` - Nice one!
    -   `WhatAPlay`: `14` - What a play!
    -   `GreatClear`: `15` - Great clear!
    -   `NiceBlock`: `16` - Nice block!
-   `compliments`
    -   `NiceShot`: `9` - Nice shot!
    -   `GreatPass`: `10` - Great pass!
    -   `Thanks`: `11` - Thanks!
    -   `WhatASave`: `12` - What a save!
    -   `NiceOne`: `13` - Nice one!
    -   `WhatAPlay`: `14` - What a play!
    -   `GreatClear`: `15` - Great clear!
    -   `NiceBlock`: `16` - Nice block!
-   `reactions`
    -   `OMG`: `17` - OMG!
    -   `Noooo`: `18` - Noooo!
    -   `Wow`: `19` - Wow!
    -   `CloseOne`: `20` - Close one.
    -   `NoWay`: `21` - No way!
    -   `HolyCow`: `22` - Holy cow!
    -   `Whew`: `23` - Whew.
    -   `Siiiick`: `24` - Siiiick.
    -   `Calculated`: `25` - Calculated.
    -   `Savage`: `26` - Savage!
    -   `Okay`: `27` - Okay.
-   `apologies`
    -   `Cursing`: `28` - $#@%!
    -   `NoProblem`: `29` - No problem!
    -   `Whoops`: `30` - Whoops.
    -   `Sorry`: `31` - Sorry!
    -   `MyBad`: `32` - My bad.
    -   `Oops`: `33` - Oops.
    -   `MyFault`: `34` - My fault.
-   `postGame`
    -   `Gg`: `35` - GG
    -   `WellPlayed`: `36` - Well played.
    -   `ThatWasFun`: `37` - That was fun!
    -   `Rematch`: `38` - Rematch!
    -   `OneMoreGame`: `39` - One more game!
    -   `WhatAGame`: `40` - What a game!
    -   `NiceMoves`: `41` - Nice moves!
    -   `EverybodyDance`: `42` - Everybody dance!
-   `custom`
    -   `Toxic_WasteCPU`: `44` - Waste of CPU cycles
    -   `Toxic_GitGut`: `45` - Git gud\*
    -   `Toxic_DeAlloc`: `46` - De-Allocate Yourself
    -   `Toxic_404NoSkill`: `47` - 404: Your skill not found
    -   `Toxic_CatchVirus`: `48` - Get a virus
    -   `Useful_Passing`: `49` - Passing!
    -   `Useful_Faking`: `50` - Faking!
    -   `Useful_Demoing`: `51` - Demoing!
    -   `Useful_Bumping`: `52` - BOOPING
    -   `Compliments_TinyChances`: `53` - The chances of that was 47525 to 1\*
    -   `Compliments_SkillLevel`: `54` - Who upped your skill level?
    -   `Compliments_proud`: `55` - Your programmer should be proud
    -   `Compliments_GC`: `56` - You're the GC of Bots
    -   `Compliments_Pro`: `57` - Are you <Insert Pro>Bot? \*


## Setting up a development environment

You'll need:

- Node.js

- Python 3.7

- windows-build-tools, which you can get with node.js by running `$ npm install -g windows-build-tools` **in an administrator terminal**. This is used to build some dependencies that are in C or C++.

1. Fork this repo (if you aren't a collaborator)

1. Clone your fork or SuperVK/RLBotJS with: `$ git clone https://github.com/[username/SuperVK]/RLBotJS.git`

1. Clone the example bot with: `$ git clone https://github.com/SuperVK/RLBotJavascriptExample.git`

1. Go into RLBotJS: `$ cd ./RLBotJS`

1. Install deps: `$ npm install`

1. Make changes

1. Link it globally: `$ npm link` or skip this step

1. Go into the example: `$ cd ../RLBotJavascriptExample`

1. Link it with the changes you made: `$ npm link rlbot-test`. **If you skipped step 7 run `$ npm install ../RLBotJS` instead**

1. Test your changes with `run.bat` in the rlbot folder of the example bot or the new GUI

1. You're all done! Now, you might want commit your changes (in the RLBotJS directory) and push those changes (in the RLBotJS directory), and then make a pull request.
