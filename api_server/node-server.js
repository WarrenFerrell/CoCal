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
      console.log( "groups result: " + user.groups );
      res.json( user.groups );
    });
  // models.User.find( { members: userID }, function( error, result ) {
  //   console.log( "groups result: " + result );
  //   res.json( result );
  // } );
});

server.post( '/api/v1/events', function(req, res) {
 var details = req.body;
 console.log( details );
 res.send();
});

var server_port = 3111;
server.listen( server_port, function() {
  console.log( "Running server on " + server_port );
});