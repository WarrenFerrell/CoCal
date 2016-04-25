var models = require('./db_schema');
var public_cal = "571838cce4b0a280eaf4954a";

var get_event = function(req, res) {
  // this endpoint returns the information about a specfic event
  var eventID = req.params['eventID'];

  models.Event
    .findById( eventID, function( error, event ) {
      if( error ) {
        var errorString = "error finding event with id=" + eventID + ", " + error;
        console.log( errorString );
        res.status(500).send( errorString );
        return;
      }
      else {
        if( event ) {
          res.json( event );
        }
        else {
          var errorString = "No event with that id";
          console.log( errorString );
          res.status(500).send( errorString );
          return;
        }
      }
    });
};

 var new_event = function(req, res) {
  // when posting to this url, we need to create an event on the db,
  // then add it to the appropriate places. it should always be put onto
  // the creating user's personal calendar, as well as any selected
  // calendars, such as a group
  // we get the userID and other details from the post body
  var id_user = req.body.id_user;
  var id_calendar = req.body.id_calendar;
  var id_group = req.body.id_group;



  // first, we create the document with the appropriate values
  newEvent = new models.Event();
  newEvent.title = req.body.title;
  newEvent.cost = req.body.cost;
  newEvent.location = { cord: req.body.location.geometry.location, loc_id: req.body.location.id };
  newEvent.description = req.body.description;
  newEvent.startsAt = req.body.startsAt;
  newEvent.endsAt = req.body.endsAt;
  newEvent.category = req.body.category;
  newEvent.privacy = req.body.id_group;
  newEvent.owner = req.body.id_user;

  // now we commit it to the database
  // afater saving it, we will add it to the user's personal calendar,
  // and we need to ensure that it happened properly.
  // if not, return an error to the app
  newEvent.save( function(error) {
    if( error ) {
      var errorString = "Error saving new event: " + error;
      console.log( errorString );
      res.status(500).send(errorString);
      return;
    }

    models.Calendar
      .findByIdAndUpdate( id_calendar, { $push: { events: newEvent._id } } )
      .exec( function( error, result ) {
        if( error ) {
          var errorString = "Error saving event to calendar: " + error
          console.log( errorString );
          res.status(500).send( errorString );
          return;
        }
      }) // end exec
    
    if( id_group === "Public" ) {
      models.Calendar
        .findByIdAndUpdate( public_cal, { $push: { events: newEvent._id } } )
        .exec( function( error, result ) {
          if( error ) {
            var errorString = "Error saving event to public calendar: " + error
            console.log( errorString );
            res.status(500).send( errorString );
            return;
          }
        })
    }
    else if( id_group === "Private" ) {
      // only post to personal calendar
    }
    else {
      // post to personal and specific group
      console.log( "Trying to post new event to group calendar: " + id_group );
      models.Calendar
        .findByIdAndUpdate( id_group, { $push: { events: newEvent._id } } )
        .exec( function( error, result ) {
            if( error ) {
              var errorString = "Error adding saved event to group calendar: " + error;
              console.log( errorString );
              res.status(500).send( errorString );
              return;
            }
          }) // end exec
      ; // end post to group calendar
    }

    res.json( { new_event_id: newEvent._id } );
  }); // end newEvent.save()
};


var remove_event = function(req, res) {
  var id_user_calendar = req.body.id_user_calendar;
  var id_event = req.body.id_event;
  var id_group = req.body.id_group;

  models.Event
    .findByIdAndRemove( id_event )
    .exec( function( error, result ) {
      if( error ) {
        var errorString = "Error deleting event: " + error;
        console.log( errorString );
        res.status(500).send( errorString );
        return;
      }
      console.log( "Event " + id_event + " deleted" );
    })

  models.Calendar
    .findByIdAndUpdate( id_user_calendar, { $pull: { events: id_event } } )
    .exec( function( error, result ) {
      if( error ) {
        var errorString = "Error removing deleted event from user calendar: " + error;
        console.log( errorString );
        res.status(500).send( errorString );
        return;
      }
      console.log( "Event removed from user calendar" );
    })

  if( id_group === "Public" ) {
      models.Calendar
        .findByIdAndUpdate( public_cal, { $pull: { events: id_event } } )
        .exec( function( error, result ) {
          if( error ) {
            var errorString = "Error removing event from public calendar: " + error
            console.log( errorString );
            res.status(500).send( errorString );
            return;
          }
          console.log( "Event removed from public calendar" );
        })
    }
    else if( id_group === "Private" ) {
    }
    else {
      models.Calendar
        .findByIdAndUpdate( id_group, { $pull: { events: id_event } } )
        .exec( function( error, result ) {
            if( error ) {
              var errorString = "Error removing saved event from group calendar: " + error;
              console.log( errorString );
              res.status(500).send( errorString );
              return;
            }
            console.log( "Event removed from " + id_group + " calendar" );
          })  
    }
  res.send();
};

//callback functions must be exported for node-server.js to make use of
exports.get_event = get_event;
exports.new_event = new_event;
exports.remove_event = remove_event;