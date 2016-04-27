'use strict';

calendar.controller( "Controller_Group_Meta", function( $scope, $state, $http, $stateParams, $view, $cookieStore ) {
  var user = $cookieStore.get('globals');
  if(user == undefined) {
    $state.go("user", {}, {reload: true});
    return;
  }

  $http.get( 'http://localhost:3111/api/v1/groups/' + $cookieStore.get('globals').currentUser.id_user )
    .success( function(response) {
      $scope.Groups = response;
    })
    .error( function() {
      console.log( "error" );
    })
  ;

  $scope.event_clicked_groupName = function( id ) {
    $state.go( "group.id", { id_group: id } );
  };

  $scope.event_clicked_createGroup = function() {
    $state.go( "group.new" );
  };
});
