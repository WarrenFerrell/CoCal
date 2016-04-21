'use strict';
calendar.controller( "Controller_Notifications", function( $scope, $state, $http, $stateParams, $view, Session ) {
  $http.get( 'http://localhost:3111/api/v1/notifications/' + Session.id_user )
    .success( function(response) {
	  if(response.length == 0) {
		  $scope.notifications = ["You have no notifications at this time"];
	  }
	  else {
		$scope.notifications = response;
	  }
    })
    .error( function() {
      console.log( "error getting notifications" );
    })
  ;

  $scope.event_clicked_clearNotifications = function() {
    console.log( "clicked save" );
    $http.post( 'http://localhost:3111/api/v1/notifications/' + Session.id_user)
      .success( function( response ) {
        console.log( response );
      })
      .error( function() {
        console.log( "couldn't clear notifications" );
      });
  };

});

