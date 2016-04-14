'use strict';

calendar.controller( "Controller_Group", function( $scope, $state, $http, $stateParams, $view ) {
  $http.get( 'http://localhost:3111/api/v1/group/' + $stateParams.id_group )
    .success( function(response) {
      $scope.group = response;
      console.log( response );
    })
    .error( function() {
      console.log( "error" );
    })
  ;
  $scope.calendarView = 'month';
  $scope.calendarDate = moment();
});
