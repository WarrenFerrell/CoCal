'use strict';

calendar.controller( "Controller_Group_New", function( $scope, $state, $http, $cookieStore ) {
  $scope.alert = null;
  $scope.alert_failedSave = { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' };

  $scope.onClick_save = function() {
    var details = {
      name: $scope.input_name,
      id_user: $cookieStore.get('globals').currentUser.id_user
    };

    $http.post( 'http://localhost:3111/api/v1/groups', details )
      .success( function( response ) {
        console.log( "Group succesfully created; id=" + response.new_id );
        $state.go( "^.id", { id_group: response.new_id }, { reload: true } );
      })
      .error( function() {
        console.log( "couldn't create new group" );
        $scope.alert = $scope.alert_failedSave;
      })
    ;
  }
});
