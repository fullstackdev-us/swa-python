# React + TypeScript + Vite

#### With Python Azure Functions

# Requirements

- Install the Static Web App (SWA) command line tool (CLI) https://azure.github.io/static-web-apps-cli/docs/use/install
- Install Node.js manually or via NVM https://github.com/nvm-sh/nvm
- Install Static web app extension in vscode https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps
- Install python 3.11.9 https://www.python.org/downloads/release/python-3119/
- Install and run Azurite emulator via powershell: `npm install -g azurite` then `azurite`

# Getting started

- Clone the repo to your machine
- Run `npm install` in the root directory
- Run `swa start` in the root directory. This starts the azure static webapp emulator - starting the python function back-end and the react front end simultaneously.
- Browse to `http://localhost:4280/`
