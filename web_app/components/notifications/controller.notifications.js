'use strict';
calendar.controller( "Controller_Notifications", ['$scope', '$http', '$stateParams', function( $scope, $http, $stateParams ) {
  $scope.user = "Test";
  $scope.notifications = "THESE ARE NOTIFICATIONS";
  $scope.cleared = "THESE USED TO BE NOTIFICATIONS";

  $http.get( 'http://localhost:3111/api/v1/groups/56ef8bda7c2acb755acfdd1a' )
    .success( function(response) {
      console.log( response );
      $scope.Groups = response;
    })
    .error( function() {
      console.log( "error getting groups" );
    })
  ;

  $scope.onClick_save = function() {
    console.log( "clicked save" );
    var details = {
      title: $scope.input_title,
      notifications: $scope.notifications,
	  clearedNotifications: $socpe.cleared
    };

    $http.post( 'http://localhost:3111/api/v1/events', details )
      .success( function( response ) {
        console.log( "cool" );
      })
      .error( function() {
        console.log( "couldn't create new event" );
      });
  };

}]);

