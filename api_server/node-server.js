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
var models = require('./db_schema'); // representations of the DB for mongoose to communicate with mongo

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

server.get( '/api/v1/events/:id', function(req, res) {
  var id = req.params['id'];
  var obj = { 
    Title: 'item ' + id,
    Cost: '$' + id,
    Category: 'testCategory',
    Location: 'testLocation',
    Description: 'testDescription'
  };
  res.json( obj );
});



server.get( '/api/v1/group/:id', function(req, res) {
  // this endpoint will return the information for a specific group,
  // including a list of all the members and their information
  var groupID = req.params['id'];
  models.Group
    .findOne( { _id: groupID } )
    .populate({
      path: 'members', // expand the list of members
      select: 'name _id' // but only include their name's and id's
    })
    .exec( function( error, result ) {
      if( error ) {
        console.log( "group id error" );
        return;
      }
      else {
        if( result ) {
          console.log( result );
          res.json( result );
        }
        else {
          console.log( "group id not found" );
          res.send( 500 );
          return;
        }
      }
    });
});

server.get( '/api/v1/calendar/:calendarID', function(req, res) {
  // this endpoint should return a list of all the groups that a user belongs to
  var calendarID = req.params['calendarID'];

  // console.log( "calendarID: " + calendarID );

  models.Calendar
    .findOne( { _id : calendarID } )
    .populate({
      path: 'events', // expand out all of the groups
    })
    .exec( function( error, calendar ) {
      if( error ) {
        var errorString = "error finding calendar with id=" + calendarID + ", " + error;
        console.log( errorString );
        res.status(500).send( errorString );
        return;
      }
      else
      {
        if( calendar && calendar.events ) {
          // console.log( "events result: " );
          // console.log( calendar.events );
          res.json( calendar.events );
        }
        else {
          var errorString = "No calendar or calendar events";
          console.log( errorString );
          res.status(500).send( errorString );
          return;
        }
      }
    }
  );
});

server.get( '/api/v1/groups/:userID', function(req, res) {
  // this endpoint should return a list of all the groups that a user belongs to
  var userID = req.params['userID'];

  console.log( "user id: " + userID );

  models.User
    .findOne( { _id : userID } )
    .populate({
      path: 'groups', // expand out all of the groups
      select: 'name _id' // but we only need the id and name
    })
    .exec( function( error, user ) {
      if( error ) {
        var errorString = "error finding user with id=" + userID + ", " + error;
        console.log( errorString );
        res.status(500).send( errorString );
        return;
      }
      else
      {
        if(user && user.groups) {
          // console.log( "groups result: " );
          // console.log( user.groups );
          res.json( user.groups );
        }
        else {
          var errorString = "No user or user groups";
          console.log( errorString );
          res.status(500).send( errorString );
          return;
        }
      }
    }
  );
});

server.post( '/api/v1/users', function(req, res) {
  newUser = new models.User();
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.password = req.body.password;

  newUser.save( function( error ) {
    if( error ) {
      var errorString = "error saving new user: " + error;
      console.log( errorString );
      res.status(500).send( errorString );
      return;
    }

    theirCalendar = new models.Calendar();
    theirCalendar.name = newUser.name +"'s Personal";
    theirCalendar.owner = newUser._id;

    theirCalendar.save( function( error2 ) {
      if( error2 ) {
        var errorString = "Error saving new user's calendar: " + error2;
        console.log( errorString );
        res.status(500).send( errorString );
        return;
      };
      newUser.calendar = theirCalendar._id;
      newUser.save( function( error3 ) {
        res.json( { newId: newUser._id, calendar: newUser.calendar } );
      });
    });
  });
});

server.post( '/api/v1/events', function(req, res) {
  // when posting to this url, we need to create an event on the db,
  // then add it to the appropriate places. it should always be put onto
  // the creating user's personal calendar, as well as any selected
  // calendars, such as a group
  // we get the userID and other details from the post body
  console.log(req.body);
  var userID = req.body.userID;
  var groupID = "???";

  console.log( "userID: " + userID );

  // first, we create the document with the appropriate values
  newEvent = new models.Event();
  newEvent.title = req.body.title;
  newEvent.cost = req.body.cost;
  newEvent.location = req.body.location;
  newEvent.description = req.body.description;
  newEvent.startsAt = req.body.startsAt;
  newEvent.endsAt = req.body.endsAt;
  newEvent.category = req.body.category;

  // define the below function to avoid putting it into three places
  var saveToPersonalCalendar = function(eventID, userID) {
    models.User
      .findOne()
      .where( { _id: userID } )
      .populate({
        path: 'calendar', // expand out the calendar reference
        select: 'name _id' // but only display the name and id
      })
      .exec( function( error, user ) {
        if( error ){
          console.log( "saveToPersonalCalendar: error retrieving user" );
          return false;
        }
        console.log( user );
        if( !user ) {
          console.log( "saveToPersonalCalendar: no matching user found" );
          return false;
        }
        models.Calendar.update(
          { _id: user.calendar._id },
          { $push: {
              events: eventID
            }
          },
          function( error2, result ) {
            if( error2 ) {
              consoloe.log( "saveToPersonalCalendar: error saving event to calendar: " + error2 );
              return false;
            }
            console.log( "event saved to personal calendar" );
            return true;
          }
        );
      })
    ;
  }

  // now we commit it to the database
  // afater saving it, we will add it to the user's personal calendar,
  // and we need to ensure that it happened properly.
  // if not, return an error to the app
  var savedToCalendarCorrectly = false;
  newEvent.save( function(error) {
    if( error ) {
      var errorString = "Error saving new event: " + error;
      console.log( errorString );
      res.status(500).send(errorString);
      return;
    }

    if( req.body.privacy === "Public" ) {
      // post to personal calendar, and maybe some public one???
      savedToCalendarCorrectly = saveToPersonalCalendar( newEvent._id, userID );
    }
    else if( req.body.privacy === "Private" ) {
      // only post to personal calendar
      savedToCalendarCorrectly = saveToPersonalCalendar( newEvent._id, userID );
    }
    else {
      // post to personal and specific group
      savedToCalendarCorrectly = saveToPersonalCalendar( newEvent._id, userID );

      models.Group
        .findByIdAndUpdate( groupID, { $push: { events: newEvent._id } },
          function( error, result ) {
            if( error ) {
              var errorString = "error adding saved event to calendar: " + error;
              console.log( errorString );
              res.status(500).send( errorString );
              return;
            }
          }
        )
      ; // end post to group calendar
    }

    res.send();
  })
});

// now that the endpoints have been created, start the server
var server_port = 3111;
server.listen( server_port, function() {
  console.log( "Running backend nodejs server on port " + server_port );
});