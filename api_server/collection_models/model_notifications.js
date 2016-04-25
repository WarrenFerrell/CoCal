var models = require('./db_schema');

var get_notifications_user = function(req, res) {
  var userID = req.params['userID'];
  models.User
    .findOne( { _id : userID } )
    .exec( function( error, user ) {
      if( error ) {
        console.log( "error finding user with id=" + userID + ", " + error );
        res.send( 500 );
      }
      else
      {
        if( user && user.notifications ) {
          res.json( user.notifications );
        }
        else {
          console.log( "no use for notifications" );
          res.send( 500 );
        }
      }
    }); // end exec
  ; // end models.User
};

var get_notifications_event = function(req, res) {
  var admin_list;
  models.User.find({isadmin: true})
    .exec( function( error, result ) {
        if( error ) {
          var errorString = "Error saving event to calendar: " + error
          console.log( errorString );
          res.status(500).send( errorString );
          return;
        }
        admin_list = result;
      }
    ) // end exec
  console.log("Admin notification")
  debugger;
  var x = req.params['eventID'];
  var message = "Event with id " + x + " reported.";
  res.json(admin_list);
};


var new_notification_user = function(req, res) {
  var userID = req.params['userID'];
  models.User
    .findOneAndUpdate({ _id : userID}, {notifications : []},function(err,user) {
      if(err) { console.log("shit"); }
      else {res.json({ notifications: user.notifications});}
    });
};


var new_notification_delete_event = function(req, res) {
  var userID = req.params['userID'];
  var x = req.params['eventID'];
  var message = "Event with id " + x + " deleted.";
  models.User
    .findOneAndUpdate({ _id : userID}, {$push: {notifications : message}},function(err,user) {
      if(err) { console.log("shit"); }
      else {res.json({ notifications: user.notifications});}
    });
};


var new_notification_event = function(req, res) {
  var admin_list;
  models.User.find({isadmin: true})
    .exec( function( error, result ) {
        if( error ) {
          var errorString = "Error saving event to calendar: " + error
          console.log( errorString );
          res.status(500).send( errorString );
          return;
        }
        admin_list = result;
      }
    ) // end exec

  var x = req.params['eventID'];
  var message = "Event with id " + x + " reported.";
  admin_list.forEach(function(admin_id){
    models.User.findOneAndUpdate({ _id : admin_id}, {$push: {notifications : message}},function(err,user) {
      if(err) { console.log("shit"); }
      else {res.json({ notifications: user.notifications});}
    });
  });
};


//callback functions must be exported for node-server.js to make use of
exports.get_notifications_event = get_notifications_event;
exports.get_notifications_user = get_notifications_user;
exports.new_notification_event = new_notification_event;
exports.new_notification_user = new_notification_user;
exports.new_notification_delete_event = new_notification_delete_event;