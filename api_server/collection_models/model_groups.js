var models = require('./db_schema');

var get_group = function(req, res) {
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
};


var get_user_groups = function(req, res) {
  // this endpoint should return a list of all the groups that a user belongs to
  var userID = req.params['userID'];
  console.log( "userID = " + userID );
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
    }) // end exec
  ; // end models.User
};


var new_group = function(req, res) {
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
      }) // end exec
    ; // end models.User
  });
};


var remove_group = function (req, res) {
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
    }) // end exec
  ; // end models.User
};

exports.get_group = get_group;
exports.get_user_groups = get_user_groups;
exports.new_group = new_group;
exports.remove_group = remove_group;