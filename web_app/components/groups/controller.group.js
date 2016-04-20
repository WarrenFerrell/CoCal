'use strict';

calendar.controller( "Controller_Group", function( $scope, $state, $http, $stateParams, $view, EventTransform ) {
  $http.get( 'http://localhost:3111/api/v1/group/' + $stateParams.id_group )
    .success( function(response) {
      $scope.group = response;
      var events = [];
      angular.forEach( response.calendar.events, function( value, index ) {
        events.push( EventTransform.toNg(value) );
      });
      $scope.events = events;
      console.log( response );
    })
    .error( function() {
      console.log( "error" );
    })
  ;
  $scope.calendarView = 'month';
  $scope.calendarDate = moment();
  $scope.isCellOpen = true;
});
