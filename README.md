# RLBotJS

## Example can be found at: https://github.com/SuperVK/RLBotJavascriptExample

## Installation guide

Over at https://github.com/SuperVK/RLBotJavascriptExample#installation-guide aswell

## Development Environment

You'll need:

- Node.js

- Python 3.7

- windows-build-tools, which you can get with node.js by running `$ npm install -g windows-build-tools` **in a administrator terminal**. This is used to build some dependencies that are in C or C++.

1. Fork this repo (if you aren't a collaborator)

1. Clone your fork or SuperVK/RLBotJS with: `$ git clone https://github.com/[username/SuperVK]/RLBotJS.git`

1. Clone the example bot with: `$ git clone https://github.com/SuperVK/RLBotJavascriptExample.git`

1. Go into RLBotJS: `$ cd ./RLBotJS`

1. Install deps: `$ npm install`

1. Make changes

1. Link it globally: `$ npm link` or skip this step

1. Go into the example: `$ cd ../RLBotJavascriptExample`

1. Link it with the changes you made: `$ npm link rlbot-test`. **If you skipped step 9 run `$ npm install ../RLBotJS` instead**

1. Test your changes with `run-gui.bat` in the rlbot folder, `run.bat` in the rlbot folder, or the new GUI

1. You're all done! Now, you might want commit your changes (in the RLBotJS directory) and push those changes (in the RLBotJS directory), and then make a pull request.
