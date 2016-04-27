'use strict';

calendar.controller( "Controller_Event_Edit",
  ['$scope', '$http', '$state', '$stateParams', '$cookieStore', '$timeout',
  function( $scope, $http, $state, $stateParams, $cookieStore, $timeout ) {
    $scope.editEnabled = true;
    const id_event = $stateParams.id_event;
    console.log( "event id = " + id_event );
    $http.get( 'http://localhost:3111/api/v1/event/' + id_event )
      .success( function(response) {
        console.log( "returned event" );
        console.log( response );
        $scope.input_title = response.title;
        $scope.input_category = response.category;
        $scope.input_privacy = response.privacy;
        $scope.input_cost = response.cost;
        $scope.input_location = response.location;
        $scope.input_description = response.description;
        $timeout(function () {
          console.log("hopefully")
          $scope.eventForm.$setPristine();
        });
      })
      .error( function() {
        console.log( "error getting event" );
      })
    ;

  $scope.Categories = ['Art', 'Entertainment', 'Dog Shows', 'Athletic Competitions'];
  $scope.input_category = $scope.Categories[0];
  $scope.input_privacy = "Public";

  $scope.alert = null;
  $scope.alert_failedSave = { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' };

  $scope.closeAlert = function() {
    $scope.alert = null;
  };

  $http.get( 'http://localhost:3111/api/v1/groups/' + $cookieStore.get('globals').currentUser.id_user )
    .success( function(response) {
      console.log( response );
      $scope.Groups = response;
    })
    .error( function() {
      console.log( "error getting groups" );
    })
  ;

  $scope.onClick_save = function() {
    var datetime_start = new Date(
              $scope.input_date_start.getFullYear(),
              $scope.input_date_start.getMonth(),
              $scope.input_date_start.getDate(),
              $scope.input_time_start.getHours(),
              $scope.input_time_start.getMinutes(),
              0
          );
    var datetime_end = new Date(
              $scope.input_date_end.getFullYear(),
              $scope.input_date_end.getMonth(),
              $scope.input_date_end.getDate(),
              $scope.input_time_end.getHours(),
              $scope.input_time_end.getMinutes(),
              0
          );
    console.log( "Start: " + datetime_start );
    console.log( "End: " + datetime_end );

    var details = {
      title: $scope.input_title,
      cost: $scope.input_cost,
      location: $scope.input_location,
      description: $scope.input_description,
      startsAt: datetime_start.toJSON(),
      endsAt: datetime_end.toJSON(),
      category: $scope.input_category,
      id_group: $scope.input_privacy,

      id_user: $cookieStore.get('globals').currentUser.id_user,
      id_calendar: $cookieStore.get('globals').currentUser.id_calendar
    };

    $http.post( 'http://localhost:3111/api/v1/event', details )
      .success( function( response ) {
        console.log( "event succesfully updated" );
        $state.go( "calendar", {}, { reload: true } );
      })
      .error( function() {
        console.log( "couldn't create new event" );
        $scope.alert = $scope.alert_failedSave;
      })
    ;
  };

  $scope.date_options = {
    showWeeks: false,
  };

  $scope.hours_24 = true;
  $scope.hstep = 1;
  $scope.mstep = 1;

  const now = moment().toDate();
  $scope.input_date_start = now;
  $scope.input_date_end = now;
  $scope.input_time_start = now;
  $scope.input_time_end = moment().add(1, 'hour').toDate();

}]);
