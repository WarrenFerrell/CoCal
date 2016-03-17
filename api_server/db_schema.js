var mongoose = require('mongoose');

var schema_Event = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  category: String,
  cost: Number
});

var schema_User = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isadmin: Boolean,
  groups: [ { type: mongoose.Schema.Types.ObjectId, 
            ref: 'Group' } ]
});

var schema_Group = new mongoose.Schema({
  name: String,
  members: [ { type: mongoose.Schema.Types.ObjectId,
             ref: 'User' }],
  events: [ { type: mongoose.Schema.Types.ObjectId,
            ref: 'Event' }]
});

var Event = mongoose.model( "Event", schema_Event );
var User = mongoose.model( "User", schema_User );
var Group = mongoose.model( "Group", schema_Group );

exports.Event = Event;
exports.User = User;
exports.Group = Group;