var express = require('express');
var app = express();

app.get( '/', function(req, res) {
  res.sendFile( '/Users/justinmcbride/working/cal/index.html' );
} );

var server_port = 3111;
app.listen( server_port, function() {
  console.log( "Running server on " + server_port );
});