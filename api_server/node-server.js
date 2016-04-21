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

server.get( '/api/v1/group/:id', function(req, res) {
  // this endpoint will return the information for a specific group,
  // including a list of all the members and their information
  const id_group = req.params['id'];
  models.Group
    .findOne( { _id: id_group } )
    .populate({
      path: 'members', // expand the list of members
      select: 'name _id' // but only include their name's and id's
    })
    .populate({
      path: 'calendar',
      populate: {
        path: 'events',
        model: 'Event'
      }
    })
    .exec( function( error, result ) {
      if( error ) {
        var errorString = "Error while finding group: " + error;
        console.log( errorString );
        res.status(500).send( errorString );
        return;
      }
      else {
        if( result ) {
          res.json( result );
        }
        else {
          var errorString = "Group not found with id=" + id_group;
          console.log( errorString );
          res.status(500).send( errorString );
          return;
        }
      }
    });
});

server.get( '/api/v1/event/:eventID', function(req, res) {
  // this endpoint returns the information about a specfic event
  var eventID = req.params['eventID'];

  models.Event
    .findById( eventID, function( error, event ) {
      if( error ) {
        var errorString = "error finding event with id=" + eventID + ", " + error;
        console.log( errorString );
        res.status(500).send( errorString );
        return;
      }
      else {
        if( event ) {
          res.json( event );
        }
        else {
          var errorString = "No event with that id";
          console.log( errorString );
          res.status(500).send( errorString );
          return;
        }
      }
    });
});

server.get( '/api/v1/calendar/:calendarID', function(req, res) {
  // this endpoint should return a list of all the groups that a user belongs to
  var calendarID = req.params['calendarID'];

  models.Calendar
    .findOne( { _id : calendarID } )
    .populate({
      path: 'events', // expand out all of the events in the group
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
  models.User
    .findOne( { _id : userID } )
    .populate({
      path: 'groups', // expand out all of the groups
    })
    .exec( function( error, user ) {
      if( error ) {
        var errorString = "Error finding user with id=" + userID + ", " + error;
        console.log( errorString );
        res.status(500).send( errorString );
        return;
      }
      else
      {
        if(user && user.groups) {
          res.json( user.groups );
          return;
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

server.get( '/api/v1/notifications/:userID', function(req, res) {
  var userID = req.params['userID'];
  models.User
    .findOne( { _id : userID } )
    .exec( function( error, user ) {
      if( error ) {
        console.log( "error finding user with id=" + userID + ", " + error );
        res.send( 500 );
      }
      else
      {
        if(user && user.notifications) {
          console.log( "notifications result: " );
          console.log( user.notifications );
          res.json( user.notifications );
        }
        else {
			console.log( "no use for notifications" );
          res.send( 500 );
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
      var errorString = "Error saving new user: " + error;
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
        // should check for error here
        res.json( { newId: newUser._id, calendar: newUser.calendar } );
      });
    });
  });
});

server.post( '/api/v1/groups', function(req, res) {
  const id_user = req.body.id_user;

  newGroup = new models.Group();
  newGroup.name = req.body.name;
  newGroup.members = [ id_user ];

  newGroup.save( function( error ) {
    if( error ) {
      var errorString = "Error saving new group: " + error;
      console.log( errorString );
      res.status(500).send( errorString );
      return;
    };

    theirCalendar = new models.Calendar();
    theirCalendar.name = newGroup.name +" Group Calendar";
    theirCalendar.owner = id_user;

    theirCalendar.save( function( error2 ) {
      if( error2 ) {
        var errorString = "Error saving new user's calendar: " + error2;
        console.log( errorString );
        res.status(500).send( errorString );
        return;
      };
      newGroup.calendar = theirCalendar._id;
      newGroup.save( function( error3 ) {
        // should check for error here
        res.json( { new_id: newGroup._id, calendar: newGroup.calendar } );
      });
    });

    models.User
      .findByIdAndUpdate( id_user, { $push: { groups: newGroup._id } } )
      .exec( function( error2, result ) {
          if( error2 ) {
            var errorString = "Error adding group to user: " + error2
            console.log( errorString );
            res.status(500).send( errorString );
            return;
          }
        }
      ) // end exec
    ;
  });
});

server.post('/api/v1/group_remove', function (req, res) {
  var user_id = req.body.user_id;
  var group_id = req.body.group_id;

  models.Group
    .findByIdAndUpdate(group_id, { $pull: { members: user_id } } )
    .exec( function( error1, result1 ) {
        if( error1 ) {
          var errorString1 = "Error removing user from group: " + error1
          console.log( errorString1 );
          res.status(500).send( errorString1 );
          return;
        }
        models.User
          .findByIdAndUpdate(user_id, { $pull: { groups: group_id } } )
          .exec( function( error2, result2 ) {
              if( error2 ) {
                var errorString2 = "Error removing group from user: " + error2
                console.log( errorString2 );
                res.status(500).send( errorString2 );
                return;
              }
              res.send();
            }
          ) // end exec
      }
    ) // end exec
});

server.post( '/api/v1/events', function(req, res) {
  // when posting to this url, we need to create an event on the db,
  // then add it to the appropriate places. it should always be put onto
  // the creating user's personal calendar, as well as any selected
  // calendars, such as a group
  // we get the userID and other details from the post body
  console.log("event to be added to db:");
  console.log(req.body);
  var id_user = req.body.id_user;
  var id_calendar = req.body.id_calendar;
  var id_group = req.body.id_group;

  // first, we create the document with the appropriate values
  newEvent = new models.Event();
  newEvent.title = req.body.title;
  newEvent.cost = req.body.cost;
  newEvent.location = req.body.location;
  newEvent.description = req.body.description;
  newEvent.startsAt = req.body.startsAt;
  newEvent.endsAt = req.body.endsAt;
  newEvent.category = req.body.category;

  // now we commit it to the database
  // afater saving it, we will add it to the user's personal calendar,
  // and we need to ensure that it happened properly.
  // if not, return an error to the app
  newEvent.save( function(error) {
    if( error ) {
      var errorString = "Error saving new event: " + error;
      console.log( errorString );
      res.status(500).send(errorString);
      return;
    }

    models.Calendar
      .findByIdAndUpdate( id_calendar, { $push: { events: newEvent._id } } )
      .exec( function( error, result ) {
          if( error ) {
            var errorString = "Error saving event to calendar: " + error
            console.log( errorString );
            res.status(500).send( errorString );
            return;
          }
        }
      ) // end exec
    ;
    if( id_group === "Public" ) {
      // post to personal calendar, and maybe some public one???
    }
    else if( id_group === "Private" ) {
      // only post to personal calendar
    }
    else {
      // post to personal and specific group
      console.log( "Trying to post new event to group calendar: " + id_group );
      models.Calendar
        .findByIdAndUpdate( id_group, { $push: { events: newEvent._id } } )
        .exec( function( error, result ) {
            if( error ) {
              var errorString = "Error adding saved event to group calendar: " + error;
              console.log( errorString );
              res.status(500).send( errorString );
              return;
            }
          }
        ) // end exec
      ; // end post to group calendar
    }

    res.json( { new_event_id: newEvent._id } );
  });
});

// now that the endpoints have been created, start the server
var server_port = 3111;
server.listen( server_port, function() {
  console.log( "Running backend nodejs server on port " + server_port );
});
