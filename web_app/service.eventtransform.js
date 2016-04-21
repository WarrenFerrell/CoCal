calendar.factory('EventTransform', function () {
  // these should be available to every controller
  var objectHolder = {};
  objectHolder.toNg = function( jsonData ) {
    return {
      title:  jsonData.title,
      startsAt: moment( jsonData.startsAt ).toDate(),
      endsAt: moment( jsonData.endsAt ).toDate(),
      type : "info",
      draggable: false,
      resizable: false,
      _id: jsonData._id,
    };
  };

  return objectHolder;
});