'use strict';
<<<<<<< HEAD
<<<<<<< HEAD

calendar.controller( "Controller_Notifications", function( $scope, $state, $http, $stateParams, $view, Session ) {
	console.log("user NOtifications " + Session.id_user);
  $http.get( 'http://localhost:3111/api/v1/notifications/' + Session.id_user )

=======
calendar.controller( "Controller_Notifications", ['$scope', '$http', '$stateParams', 'Session', function( $scope, $http, $stateParams, Session ) {
  $scope.user = "Test";
  $scope.notifications = "THESE ARE NOTIFICATIONS";
  $scope.cleared = "THESE USED TO BE NOTIFICATIONS";

  $http.get( 'http://localhost:3111/api/v1/groups/' + Session.id_user )
>>>>>>> parent of 7fcd972... Updated notifications stuff
=======
calendar.controller( "Controller_Notifications", ['$scope', '$http', '$stateParams', 'Session', function( $scope, $http, $stateParams, Session ) {
  $scope.user = "Test";
  $scope.notifications = "THESE ARE NOTIFICATIONS";
  $scope.cleared = "THESE USED TO BE NOTIFICATIONS";

  $http.get( 'http://localhost:3111/api/v1/groups/' + Session.id_user )
>>>>>>> parent of 7fcd972... Updated notifications stuff
    .success( function(response) {
      console.log( response );
      $scope.Groups = response;
    })
    .error( function() {
<<<<<<< HEAD
<<<<<<< HEAD
      console.log( "error getting notifications" );
=======
      console.log( "error getting groups" );
>>>>>>> parent of 7fcd972... Updated notifications stuff
=======
      console.log( "error getting groups" );
>>>>>>> parent of 7fcd972... Updated notifications stuff
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

