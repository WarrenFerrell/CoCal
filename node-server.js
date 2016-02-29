var express = require('express');
var server = express();

var mongoose = require('mongoose');

server.get( '/', function(req, res) {
  res.sendFile( '/Users/justinmcbride/working/cal/index.html' );
});

server.get( '/api/v1/events/:id', function(req, res) {
  var obj = { 
    Title: 'item ' + req.params['id'],
    Cost: '$' + req.params['id'],
    Category: 'testCategory',
    Location: 'testLocation',
    Description: 'testDescription'
    };
    res.json( obj );
});

var server_port = 3111;
server.listen( server_port, function() {
  console.log( "Running server on " + server_port );
});