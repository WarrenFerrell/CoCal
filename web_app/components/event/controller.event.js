'use strict';

calendar.controller( "Controller_Event", ['$scope', '$http', '$stateParams', function( $scope, $http, $stateParams ) {
  $scope.id = $stateParams.id_event;
  $scope.Categories = ['Art', 'Entertainment', 'Dog Shows', 'Athletic Competitions'];
  $scope.input_category = $scope.Categories[0];
  $scope.input_privacy = "Public";

  if( $scope.id )
  {
    $http.get( 'http://localhost:3111/api/v1/events/' + $stateParams.id_event )
      .success( function(response) {
        $scope.input_title = response.Title;
        $scope.input_cost = response.Cost;
        $scope.input_category = response.Category;
        $scope.input_location = response.Location;
        $scope.input_description = response.Description;
      })
      .error( function() {
        console.log( "error getting event" );
      })
    ;
  }

  $http.get( 'http://localhost:3111/api/v1/groups/56ef8bda7c2acb755acfdd1a' )
    .success( function(response) {
      console.log( response );
      $scope.Groups = response;
    })
    .error( function() {
      console.log( "error getting groups" );
    })
  ;

  $scope.onClick_save = function() {
    console.log( "clicked save" );
    var details = {
      title: $scope.input_title,
      cost: $scope.input_cost,
      location: $scope.input_location,
      description: $scope.input_description,
      date: $scope.input_date,
      time_start: $scope.input_time_start,
      time_end: $scope.input_time_end,
      category: $scope.input_category,
      privacy: $scope.input_privacy,
      userID: $scope.input_userID
    };

    $http.post( 'http://localhost:3111/api/v1/events', details )
      .success( function( response ) {
        console.log( "cool" );
      })
      .error( function() {
        console.log( "couldn't create new event" );
      });
  };

  $scope.date_options = {
    showWeeks: false,
  };

  $scope.hours_24 = true;
  $scope.hstep = 1;
  $scope.mstep = 15;
  $scope.input_time_start = moment();
  $scope.input_time_end = moment();
}]);