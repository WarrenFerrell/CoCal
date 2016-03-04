# CoCal
CU CSCI 4448 Project
Community calendar webapp that identifies and filters events open to the public (or within your group) in your current or a specific location. 


## Team
Justin McBride
Zachary Lamb
Adrian Chen
Warren Ferrell
Justin Schiller 

## File structure:
  ./docs/ -- All required documentation files required for incremental project updates and submissions.
  ./web_app/ -- The AngularJS front-end web application which users will interact with directly after being hosted.
  ./api_server/ -- The back-end NodeJS server with Express middleware that handles API requests from the front-end AngularJS application. This API layer will communicate with our backend database infrastructure.

## Usage
### AngularJS Application
First, within the ./web_app/ directory, run a `bower install` to install the required JS/CSS libraries.
Then, the easiest way to run this application is to run `python -m SimpleHTTPServer` within the ./web_app/ directory. Running this Python module will serve the app on `localhost:8000` by default.
### NodeJS Server
First, within the ./api_server/ directory, run a `npm install` to install the necessary NodeJS modules.
Then, execute `node node-server.js` within the ./api_server/ directory.
