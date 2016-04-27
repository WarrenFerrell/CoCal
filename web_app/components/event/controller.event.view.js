'use strict';

calendar.controller( "Controller_Event_View", 
  [ '$scope', '$http', '$state', '$stateParams', '$cookieStore', 'EventTransform', 'uiGmapGoogleMapApi', 
  function( $scope, $http, $state, $stateParams, $cookieStore, EventTransform, uiGmapGoogleMapApi ) {

    const id_event = $stateParams.id_event;
    console.log( "event id = " + id_event );
    $http.get( 'http://localhost:3111/api/v1/event/' + $stateParams.id_event )
      .success( function(response) {
        console.log( "returned event" );
        console.log( response );
        $scope.event = response;
        $scope.dateBegin = moment(response.startsAt).format('lll');
        $scope.dateEnd = moment(response.endsAt).format('lll');
        uiGmapGoogleMapApi.then(function(maps) {
            $scope.map = { center: $scope.event.location.coords, zoom: 8, bounds: {} };
            $scope.marker = { id: 0, coords: $scope.event.location.coords, options: { draggable: false}};
            console.log( "map should be made" );
        }); 
      })
      .error( function() {
        console.log( "error getting event" );
      })
    ;

    $scope.event_clicked_delete = function() {
      console.log( "trying to delete this event" );
    	$http.post('http://localhost:3111/api/v1/notifications/' + $cookieStore.get('globals').currentUser.id_user + "/" + $stateParams.id_event + '/1')
    		.success(function(response) {
    			console.log(response);
    		})
    		.error( function() {
    			console.log("dammmmn");
    		});

      var details = {
        id_user_calendar: $cookieStore.get('globals').currentUser.id_calendar,
        id_event: id_event,
        id_group: $scope.event.privacy
      };

      $http.post( 'http://localhost:3111/api/v1/event_remove', details )
        .success( function(response) {
          console.log( "event deleted" );
          $state.go("calendar");
        })
        .error( function() {
          console.log( "error deleting the event" );
        });
    };

    $scope.event_clicked_report = function() {
      console.log( "trying to report this event" );
      $http.post('http://localhost:3111/api/v1/admin_notification/' + $stateParams.id_event)
        .success(function(repsonse) {
          console.log(response);
        })
        .error( function() {
          console.log("dammmmn");
        });
    };

  $scope.event_clicked_edit = function() {
    console.log( "trying to edit event" );
    $state.go( "edit_event", { id_event: id_event } );
  }

}]);
