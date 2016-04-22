var models = require('./db_schema');

var get_user = function(req, res) {
  var userName = req.params['name'];
  console.log("User " + userName + " has logged in.");
  models.User
    .findOne( {name : userName })
    .exec(function(error, user){
      if( error ) {
        var errorString = "Error finding user: " + userName + "," + error;
        console.log( errorString );
        res.status(500).send( errorString );
        return;
      }
      else{
        if(user){
          console.log("user: " + user);
          res.json( user );
        }
        else{
          var errorString = "No user or user groups";
          console.log( errorString );
          res.status(500).send( errorString );
          return;
        }
      }
    });
};


var new_user = function(req, res) {
  newUser = new models.User();
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.password = req.body.password;
  newUser.notifications = [];
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
      }
      newUser.calendar = theirCalendar._id;
      newUser.save( function( error3 ) {
        // should check for error here
        res.json( { newId: newUser._id, calendar: newUser.calendar } );
      });
    }); //end theirCalendar.save()
  }); // end newUser.save()
}; // end post

exports.get_user = get_user;
exports.new_user = new_user;