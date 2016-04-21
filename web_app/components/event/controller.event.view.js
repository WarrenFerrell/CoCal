'use strict';

calendar.controller( "Controller_Event_View", [ '$scope', '$http', '$state', '$stateParams', 'Session', 'EventTransform', function( $scope, $http, $state, $stateParams, Session, EventTransform ) {
  const id_event = $stateParams.id_event;
  console.log( "event id = " + id_event );
  $http.get( 'http://localhost:3111/api/v1/event/' + $stateParams.id_event )
    .success( function(response) {
      console.log( "returned event" );
      console.log( response );
      $scope.event = response;
      $scope.dateBegin = moment(response.startsAt).format('lll');
      $scope.dateEnd = moment(response.endsAt).format('lll');
    })
    .error( function() {
      console.log( "error getting event" );
    })
  ;

  $scope.event_clicked_delete = function() {
    console.log( "trying to delete this event" );
    var details = {
      id_user_calendar: Session.id_calendar,
      id_event: id_event
    };
    $http.delete( 'http://localhost:3111/api/v1/event_remove', details )
      .success( function(response) {
        console.log( "event deleted" );
        $state.go("calendar");
      })
      .error( function() {
        console.log( "error deleting the event" );
      })
    ;
  };

  $scope.event_clicked_edit = function() {
    console.log( "trying to edit event" );
  }

}]);
