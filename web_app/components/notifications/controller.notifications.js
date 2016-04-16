'use strict';
calendar.controller( "Controller_Notifications", function( $scope, $state, $http, $stateParams, $view, Session ) {
  $http.get( 'http://localhost:3111/api/v1/notifications/' + Session.id_user )
    .success( function(response) {
      console.log( response );
      $scope.notifications = response;
    })
    .error( function() {
      console.log( "error getting notifications" );
    })
  ;

  $scope.event_clicked_clearNotifications = function() {
    console.log( "clicked save" );
    var details = {
      notifications: $scope.notifications,
	  clearedNotifications: $scope.cleared
    };

    $http.post( 'http://localhost:3111/api/v1/events', details )
      .success( function( response ) {
        console.log( "cool" );
      })
      .error( function() {
        console.log( "couldn't create new event" );
      });
  };

});

