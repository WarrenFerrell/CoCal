'use strict';

calendar.controller( "Controller_Home",
  ["$scope", "$state", "$http", "$cookieStore", "$filter", "EventTransform", "NgTableParams",
  function( $scope, $state, $http, $cookieStore, $filter, EventTransform, NgTableParams ) {

    $scope.clicked_Event_Go = function() {
      $state.go( 'home.event', { id_event : $scope.input_id_event } );
    };

    $scope.tableParams = new NgTableParams({}, {
      getData: function(params) {
        // ajax request to api
        return $http({ method: 'GET', url: 'http://localhost:3111/api/v1/calendar/' + $cookieStore.get('globals').currentUser.id_calendar }).then(
          function success(response) {
            var events = [];
            angular.forEach( response.data, function( value, index ) {
              events.push( EventTransform.toNg(value) );
            });
            console.log(events);
            return $filter('orderBy')(events, params.orderBy());
          },
          function error( response ) {
            return [];
          })
        ;
      }
    });
  } // end Controller_Home constructor
]);
