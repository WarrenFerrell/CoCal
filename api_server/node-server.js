var express = require('express');
var cors = require('cors')
var mongoose = require('mongoose');

var server = express();
server.use( cors() );

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

var groups = [
    { 
      name: "Dog Lovers",
      id: 1,
      members: [
        "Member 1",
        "Member 2",
        "Member 3",
        "Member 4",
        "Member 5",
      ]
    },
    { 
      name: "Cat Lovers",
      id: 2,
      members: [
        "Test 1",
        "Test 2",
        "Test 3",
        "Test 4",
        "Test 5",
      ]
    },
    { 
      name: "Brocolli Lovers",
      id: 3,
      members: []
    },
    { 
      name: "Car Lovers",
      id: 4,
      members: [
        "Justin",
        "Quinn",
        "Irfan",
        "Tim",
        "Emma Stone",
      ]
    }
];

server.get( '/api/v1/group/:id', function(req, res) {
  var id = req.params['id'];
  var result = groups.filter( function( obj ) {
    return obj.id == id;
  });
  console.log( result );
  res.json( result[0] );
});

server.get( '/api/v1/groups/', function(req, res) {
  res.json( groups );
});

var server_port = 3111;
server.listen( server_port, function() {
  console.log( "Running server on " + server_port );
});