calendar.factory('EventTransform', function () {
  // these should be available to every controller
  var objectHolder = {};
  objectHolder.toNg = function( jsonData ) {
    console.log( jsonData );
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

  return objectHolder;
});