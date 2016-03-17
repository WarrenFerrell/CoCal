'use strict';

calendar.controller( "Controller_Group_Meta", function( $scope, $state, $http, $stateParams, $view ) {
  $http.get( 'http://localhost:3111/api/v1/groups/56dd2c3aa0a5453d0baa35e9' )
    .success( function(response) {
      $scope.Groups = response;
    })
    .error( function() {
      console.log( "error" );
    })
  ;

  $scope.event_clicked_groupName = function( id ) {
    console.log( "going to group with id=" + id );
    $state.go( "group.id", { id_group: id } );
  };
});
