/*
  This is the backend server logic that will run in one place when the application is ready to be deployed.
  It contains API endpoints that the frontend AnguarJS application will communicate with in order
  to fetch, store, and modify data within our application, but this backend application
  allows us more control over what happens to the database. Our database is only accessible through
  this api, and thus we must be gate-keepers here where we validate information going into the database.
 */

// import all of the required dependencies. the following lines will crash if you have not yet
// run the `npm install` command
var express = require('express'); // creates for the rest api
var cors = require('cors'); // cross-origin request sharing allows sending data to foreign services
var bodyParser = require('body-parser'); // parses all express body requests and allows easy access to the request parameters
var mongoose = require('mongoose'); // facilitates connection to the MongoDB backend
var credentials = require('./credentials'); // local file with the MongoDB credentials. separate file so that they're not accidently commited
 // representations of the DB for mongoose to communicate with mongo
var calendars = require('./collection_models/model_calendars');
var events = require('./collection_models/model_events');
var groups = require('./collection_models/model_groups');
var notifications = require('./collection_models/model_notifications');
var users = require('./collection_models/model_users');
// do the actual connecting to the mongo database. currently it's stored on mongolabs
// and you need the credentials that are shared only internally. modify the ./credentials.js
// file with them so that mongoose can connect to mongo
var options = {
  user: credentials.mongo_user,
  pass: credentials.mongo_pass
}
mongoose.connect( "mongodb://ds023388.mlab.com:23388/cocal", options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log( "Connected to mongo" );
});

// REST api implementation is below
// this can probably be exported to a routes.js file

var server = express();
server.use( cors() );
server.use( bodyParser.json() );

server.get( '/api/v1/calendar/:calendarID', calendars.get_calendar );

server.get( '/api/v1/event/:eventID', events.get_event );
server.post( '/api/v1/events', events.new_event );
server.post( "/api/v1/event_remove", events.remove_event );

server.get( '/api/v1/group/:id', groups.get_group );
server.get( '/api/v1/groups/:userID', groups.get_user_groups );
server.post( '/api/v1/groups', groups.new_group );
server.post('/api/v1/group_remove', groups.remove_group );

server.get( '/api/v1/notifications/:userID', notifications.get_notifications_user );
server.get( '/api/v1/admin_notification/:eventID', notifications.get_notifications_event );
server.post( '/api/v1/notifications/:userID', notifications.new_notification_user );
server.post( '/api/v1/notifications/:userID/:eventID/1', notifications.new_notification_delete_event );
server.post( '/api/v1/admin_notification/:eventID', notifications.new_notification_event );

server.get( '/api/v1/users/:name', users.get_user  );
server.post( '/api/v1/users', users.new_user );

// now that the endpoints have been created, start the server
var server_port = 3111;
server.listen( server_port, function() {
  console.log( "Running backend nodejs server on port " + server_port );
});
