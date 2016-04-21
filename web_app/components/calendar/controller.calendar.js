'use strict';

calendar.controller( "Controller_Calendar", [ '$scope', '$http', '$cookieStore', 'EventTransform', function( $scope, $http, $cookieStore, EventTransform ) {
  $scope.calendarView = 'month';
  $scope.calendarDate = moment();
  $scope.isCellOpen = true;
  $http.get( 'http://localhost:3111/api/v1/calendar/' + $cookieStore.get('globals').currentUser.id_calendar)
    .success( function(response) {
      console.log( response );
      var events = [];
      angular.forEach( response, function( value, index ) {
        events.push( EventTransform.toNg(value) );
      });
      $scope.events = events;
    })
    .error( function() {
      console.log( "error getting events for calendar" );
    })
  ;

}]);
