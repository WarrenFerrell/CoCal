'use strict';
calendar.controller( "Controller_Notifications", function( $scope, $state, $http, $stateParams, $view, Session ) {
	console.log("user NOtifications " + Session.id_user);
  $http.get( 'http://localhost:3111/api/v1/notifications/' + Session.id_user )
    .success( function(response) {
      console.log( response );
      $scope.Groups = response;
    })
    .error( function() {
      console.log( "error getting notifications" );
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

});

