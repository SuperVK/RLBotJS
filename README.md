# RLBotJS 

## Example can be found at: https://github.com/RLBot/RLBotJavascriptExample

## Installation guide

If you've installed a few other npm packages already, chances are doing `npm install rlbot` works.

### if `npm install rlbot` gives an error follow this guide:

1. Install node.js (10.16.0 LTS should work)

2. Install python 2.7, but make sure to not check "add to PATH" in the installation, because then the python runner for RLBot won't run anymore

3. Open a shell with admin access, and run `npm install --global --production windows-build-tools --vs2015`, if it can't find npm launch powershell instead of cmd.

4. Then run `npm install --python=C:\path\to\python2.7\python.exe rlbot`