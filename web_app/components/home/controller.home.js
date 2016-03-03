'use strict';

calendar.controller( "Controller_Home", function( $scope, $state ) {
  $scope.clicked_Event_Go = function() {
    $state.go( 'home.event', { id_event : $scope.input_id_event } );
  };
});
