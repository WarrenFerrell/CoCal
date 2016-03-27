var mongoose = require('mongoose');

var schema_Event = new mongoose.Schema({
  title:       { type: String, default: "Event Title" },
  cost:        { type: Number, default: 0 },
  location:    { type: String, default: "" },
  description: { type: String, default: "Event Description" },
  date:        { type: Date,   default: Date.now() },
  category:    { type: String, default: "Event Category" },
});

var schema_User = new mongoose.Schema({
  name:     		{ type: String,  default: "User Name" },
  email:   			{ type: String,  default: "User Email" },
  password: 		{ type: String,  default: "UserPassword" },
  notifications: 	[ ],
  cleared: 			[ ],
  isadmin:  		{ type: Boolean, default: false },
  groups: 			[ { type: mongoose.Schema.Types.ObjectId, 
					ref: 'Group' } ],
  calendar: 		{ type: mongoose.Schema.Types.ObjectId,
					ref: 'Calendar' },
});

var schema_Group = new mongoose.Schema({
  name: { type: String, default: "Group Name" },
  members: [ { type: mongoose.Schema.Types.ObjectId,
             ref: 'User' }],
  calendar: { type: mongoose.Schema.Types.ObjectId,
              ref: 'Calendar' },
});

var schema_Calendar = new mongoose.Schema({
  name: { type: String, default: "Calendar Name" },
  owner: { type: mongoose.Schema.Types.ObjectId,
           ref: 'User' },
  events: [ { type: mongoose.Schema.Types.ObjectId,
            ref: 'Event' }]
});

var Event = mongoose.model( "Event", schema_Event );
var User = mongoose.model( "User", schema_User );
var Group = mongoose.model( "Group", schema_Group );
var Calendar = mongoose.model( "Calendar", schema_Calendar );

exports.Event = Event;
exports.User = User;
exports.Group = Group;
exports.Calendar = Calendar;