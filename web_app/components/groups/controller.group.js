'use strict';

calendar.controller( "Controller_Group", function( $scope, $state, $http, $stateParams, $view, EventTransform, $cookieStore ) {
  $http.get( 'http://localhost:3111/api/v1/group/' + $stateParams.id_group )
    .success( function(response) {
      $scope.group = response;
      var events = [];
      angular.forEach( response.calendar.events, function( value, index ) {
        events.push( EventTransform.toNg(value) );
      });
      $scope.events = events;
      console.log( response );
    })
    .error( function() {
      console.log( "error" );
    })
  ;
  $scope.calendarView = 'month';
  $scope.calendarDate = moment();
  $scope.isCellOpen = true;

  $scope.remove_group = function() {
    var details = {
      user_id: $cookieStore.get('globals').currentUser.id_user,
      group_id: $stateParams.id_group
    };
    $http.post('http://localhost:3111/api/v1/group_remove', details)
      .success( function( response ) {
        console.log( "User successfully removed from group;");
        $state.go("^", {}, {reload: true});
      })
      .error( function() {
        console.log( "Couldn't remove user from group" );
        $scope.alert = $scope.alert_failedSave;
      })
    ;
  }
});
