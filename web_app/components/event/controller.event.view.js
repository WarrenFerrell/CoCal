'use strict';

calendar.controller( "Controller_Event_View", [ '$scope', '$http', '$state', '$stateParams', 'Session', 'EventTransform', function( $scope, $http, $state, $stateParams, Session, EventTransform ) {
  console.log( "event id = " + $stateParams.id_event );
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
	$http.post('http://localhost:3111/api/v1/notifications/' + Session.id_user + "/" + $stateParams.id_event)
		.success(function(repsonse) {
			console.log(response);
		})
		.error( function() {
			console.log("dammmmn");
		});
  };

  $scope.event_clicked_report = function() {
    console.log( "trying to report this event" );
  };

}]);
