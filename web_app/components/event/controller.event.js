'use strict';

calendar.controller( "Controller_Event", ['$scope', '$http', '$stateParams', function( $scope, $http, $stateParams ) {
  $http.get( 'http://localhost:3111/api/v1/events/' + $stateParams.id_event )
    .success( function(response) {
      $scope.input_title = response.Title;
      $scope.input_cost = response.Cost;
      $scope.input_category = response.Category;
      $scope.input_location = response.Location;
      $scope.input_description = response.Description;
    })
    .error( function() {
      console.log( "error" );
    })
  ;
  $http.get( 'http://localhost:3111/api/v1/groups/' )
    .success( function(response) {
      $scope.Groups = response;
    })
    .error( function() {
      console.log( "error" );
    })
  ;
  $scope.date_options = {
    showWeeks: false,
  };
  $scope.hours_24 = false;
}]);