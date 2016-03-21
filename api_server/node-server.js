var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var credentials = require('./credentials');
var models = require('./db_schema');

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
  var groupID = req.params['id'];
  models.Group
    .findOne( { _id: groupID } )
    .populate( 'members' )
    .exec( function( error, result ) {
      if( error ) {
        console.log( "group id error" );
        return;
      }
      if( !result ) {
        console.log( "group id not found" );
        return;
      }
      console.log( result );
      res.json( result );
    });
});

server.get( '/api/v1/groups/:userID', function(req, res) {
  var userID = req.params['userID'];
  models.User
    .findOne( { _id : userID } )
    .populate({
      path: 'groups',
      select: 'name _id'
    })
    .exec( function( error, user ) {
      if( error ) {
        console.log( error );
        return;
      }
      if(user && user.groups) {
        console.log( "groups result: " + user.groups );
        res.json( user.groups );
      }
      else {
        res.send()
      }

    });
  // models.User.find( { members: userID }, function( error, result ) {
  //   console.log( "groups result: " + result );
  //   res.json( result );
  // } );
});

server.post( '/api/v1/users', function(req, res) {
  newUser = new models.User();
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.password = req.body.password;

  newUser.save( function( error ) {
    if( error ) {
      console.log( "error saving new user: " + error );
      res.send( 500, { status: 500, message: "couldn't create db entry: " + error, type: "internal" } );
      return;
    }

    theirCalendar = new models.Calendar();
    theirCalendar.name = newUser.name +"'s Personal";
    theirCalendar.owner = newUser._id;


    theirCalendar.save( function( error2 ) {
      if( error2 ) {
        console.log( "error saving new user's calendar: " + error2 );
        res.send( 500, error2 );
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
  var userID = req.body.userID;
  var groupID = "???";

  console.log( userID );


  newEvent = new models.Event();
  newEvent.title = req.body.title;
  newEvent.cost = req.body.cost;
  newEvent.location = req.body.location;
  newEvent.description = req.body.description;
  newEvent.date = req.body.date;
  newEvent.category = req.body.category;

  var saveToPersonalCalendar = function(eventID, userID) {
    console.log( userID );
    models.User
      .findOne()
      .where( { _id: userID } )
      // .select( 'calendar' )
      .populate( 'calendar' )
      .exec( function( error, user ) {
        if( error ) {
          console.log( "error finding personal calendar" );
          return false;
        }
        console.log( user );
        if( !user ) {
          return false;
        }
        user.calendar.events += eventID;
        user.calendar.save(function( error2 ) {
          if( error2 ) {
            console.log( "error2" );
            return false;
          }
          return true;
        });
      })
    ;
  }

  newEvent.save( function(error) {
    if( error ) {
      console.log( "error saving new event: " + error );
      res.send( 500, { status: 500, message: "couldn't create db entry: " + error, type: "internal" } );
      return;
    }

    if( req.body.privacy === "Public" ) {
      // post to personal calendar, and maybe some public one???
      saveToPersonalCalendar( newEvent._id, userID );
    }
    else if( req.body.privacy === "Private" ) {
      // only post to personal calendar
      saveToPersonalCalendar( newEvent._id, userID );
    }
    else {
      // post to personal and specific group
      saveToPersonalCalendar( newEvent._id, userID );

      models.Group
        .findByIdAndUpdate( groupID, { $push: { events: newEvent._id } },
          function( error, result ) {
            if( error ) {
              console.log( "error adding saved event to calendar: " + event );
              res.send( 500, { status: 500, message: "couldn't create db entry: " + error, type: "internal" } );
              return;
            }
          }
        )
      ; // end post to group calendar
    }

    res.send();
  })
});

var server_port = 3111;
server.listen( server_port, function() {
  console.log( "Running server on " + server_port );
});