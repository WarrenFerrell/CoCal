'use strict';
calendar.controller( "Controller_Notifications", ['$scope', '$http', '$stateParams', 'Session', function( $scope, $http, $stateParams, Session ) {
  $scope.user = "Test";
  $scope.notifications = "THESE ARE NOTIFICATIONS";
  $scope.cleared = "THESE USED TO BE NOTIFICATIONS";

  $http.get( 'http://localhost:3111/api/v1/groups/' + Session.id_user )
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

