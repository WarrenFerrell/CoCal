var models = require('./db_schema');

var get_calendar = function(req, res) {
  // this endpoint should return a list of all the groups that a user belongs to
  var calendarID = req.params['calendarID'];

  models.Calendar
    .findOne( { _id : calendarID } )
    .populate({
      path: 'events', // expand out all of the events in the group
    })
    .exec( function( error, calendar ) {
      if( error ) {
        var errorString = "error finding calendar with id=" + calendarID + ", " + error;
        console.log( errorString );
        res.status(500).send( errorString );
        return;
      }
      else
      {
        if( calendar && calendar.events ) {
          res.json( calendar.events );
        }
        else {
          var errorString = "No calendar or calendar events";
          console.log( errorString );
          res.status(500).send( errorString );
          return;
        }
      }
    }
  );
};

exports.get_calendar = get_calendar;