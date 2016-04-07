'use strict';

calendar.controller( "Controller_Calendar", [ '$scope', '$http', 'Session', function( $scope, $http, Session ) {

  console.log( "calendar id: " + Session.id_calendar );
  $scope.calendarView = 'month';
  $scope.calendarDate = moment();
  $scope.isCellOpen = true;

  $http.get( 'http://localhost:3111/api/v1/calendar/' + Session.id_calendar )
    .success( function(response) {
      console.log( response );
      var events = [];
      angular.forEach( response, function( value, index ) {
        var e = {
          title:  value.title,
          startsAt: moment( value.startsAt ).toDate(),
          endsAt: moment( value.endsAt ).toDate(),
          type : "info",
          draggable: false,
          resizable: false,
        };
        console.log( e );
        events.push(e);
      });
      $scope.events = events;
    })
    .error( function() {
      console.log( "error getting events for calendar" );
    })
  ;

}]);
