calendar.factory('EventTransform', function () {
  // these should be available to every controller
  var objectHolder = {};
  objectHolder.toNg = function( jsonData ) {
    return {
      title:  jsonData.title,
      cost: jsonData.cost,
      category: jsonData.category,
      startsAt: moment( jsonData.startsAt ).toDate(),
      endsAt: moment( jsonData.endsAt ).toDate(),
      type : "info",
      draggable: false,
      resizable: false,
      _id: jsonData._id,
    };
  };

  // function to make the db events look pretty
  objectHolder.toPresent = function( jsonData ) {
    return {
      title:  jsonData.title,
      cost: jsonData.cost,
      category: jsonData.category,
      location: jsonData.location.loc_id,
      startsAt: moment( jsonData.startsAt ).format('MMMM Do YYYY, h:mm:ss a'),
      endsAt: moment( jsonData.endsAt ).format('MMMM Do YYYY, h:mm:ss a'),
      startsAt_real: moment( jsonData.startsAt ).toDate(),
      endsAt_real: moment( jsonData.endsAt ).toDate(),
      _id: jsonData._id,
    };
  };

  return objectHolder;
});