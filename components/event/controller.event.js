'use strict';

calendar.controller( "Controller_Event", ['$scope', '$http', '$stateParams', function( $scope, $http, $stateParams ) {
  var id_event = $stateParams.id_event;
  $http.get( 'http://localhost:3111/api/v1/events/' + id_event )
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

}]);