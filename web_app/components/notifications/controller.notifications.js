'use strict';
calendar.controller( "Controller_Notifications", ['$scope', '$http', '$stateParams', function( $scope, $http, $stateParams ) {

	var user_id = "56ef8e229df30dea5a776488";
	console.log( "user id in notifications controller: "  + user_id );
  $http.get( 'http://localhost:3111/api/v1/notifications/' + user_id )
    .success( function(response) {
      console.log( response );
      $scope.notifications = response;
    })
    .error( function() {
      console.log( "error getting notifications" );
    });

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

