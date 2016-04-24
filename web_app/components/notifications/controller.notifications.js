'use strict';
calendar.controller( "Controller_Notifications", function( $scope, $state, $http, $stateParams, $view, $cookieStore ) {
  var user = $cookieStore.get('globals')
    if(user == undefined){
      $state.go("user", {}, {reload: true});
    }
  $scope.notifications = [];
  $scope.clearDisabled = true;

  $http.get( 'http://localhost:3111/api/v1/notifications/' + $cookieStore.get('globals').currentUser.id_user )
    .success( function(response) {
  	  if(response.length == 0) {
  		  $scope.notifications = ["You have no notifications at this time"];
        $scope.clearDisabled = true; // disable the Clear Notifications button
  	  }
  	  else {
  		  $scope.notifications = response;
        $scope.clearDisabled = false; // enable the Clear Notifications button
  	  }
    })
    .error( function() {
      console.log( "error getting notifications" );
    })
  ;

  $scope.event_clicked_clearNotifications = function() {
    $http.post( 'http://localhost:3111/api/v1/notifications/' + $cookieStore.get('globals').currentUser.id_user )
      .success( function( response ) {
        console.log( "cleared notifications" );
        $state.go( $state.current, {}, {reload: true} );
      })
      .error( function() {
        console.log( "couldn't clear notifications" );
      })
    ;
  };

});

