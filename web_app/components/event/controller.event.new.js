'use strict';

calendar.controller( "Controller_Event_New", ['$scope', '$http', '$state', '$stateParams', 'Session', function( $scope, $http, $state, $stateParams, Session ) {
  $scope.Categories = ['Art', 'Entertainment', 'Dog Shows', 'Athletic Competitions'];
  $scope.input_category = $scope.Categories[0];
  $scope.input_privacy = "Public";

  $scope.alerts = [ ];

  $scope.alert_failedSave = { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $http.get( 'http://localhost:3111/api/v1/groups/' + Session.id_user )
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
    console.log( "end: " + datetime_end );
    var details = {
      title: $scope.input_title,
      cost: $scope.input_cost,
      location: $scope.input_location,
      description: $scope.input_description,
      startsAt: datetime_start.toJSON(),
      endAt: datetime_end.toJSON(),
      category: $scope.input_category,
      privacy: $scope.input_privacy,
      userID: Session.id_user
    };

    console.log( details );

    $http.post( 'http://localhost:3111/api/v1/events', details )
      .success( function( response ) {
        console.log( "event succesfully created" );
        $state.go( "calendar" );
      })
      .error( function() {
        console.log( "couldn't create new event" );
        $scope.alerts.push( $scope.alert_failedSave );
      })
    ;
  };

  $scope.date_options = {
    showWeeks: false,
  };

  $scope.hours_24 = true;
  $scope.hstep = 1;
  $scope.mstep = 15;
  $scope.input_time_start = moment();
  $scope.input_time_end = moment().add(1, 'hour');
}]);