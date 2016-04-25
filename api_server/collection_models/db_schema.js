var mongoose = require('mongoose');

var schema_Event = new mongoose.Schema({
  title:       { type: String, default: "Default Title" },
  cost:        { type: Number, default: 0 },
  location:    { 
    cord: { lat: Number, lng: Number},
    loc_id: String
  },
  description: { type: String, default: "Default Description" },
  startsAt:    { type: Date },
  endsAt:      { type: Date },
  category:    { type: String, default: "Default Category" },
  privacy: { type: String, default: "Private" },
  owner: { type: mongoose.Schema.Types.ObjectId,
           ref: 'User' },
});

var schema_User = new mongoose.Schema({
  name:     		{ type: String,  default: "User Name" },
  email:   			{ type: String,  default: "User Email" },
  password: 		{ type: String,  default: "UserPassword" },
  notifications: 	{type: [ ], default: [ ]},
  cleared: 			{type: [ ], default: [ ]},
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