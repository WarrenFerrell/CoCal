// Reference: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation#Geolocation_Live_Example

'use strict';

calendar.controller( "Controller_Find_Events", [ '$state','$scope', '$http', '$cookieStore', 'EventTransform', 'NgTableParams', '$filter', 
    function( $state,$scope, $http, $cookieStore, EventTransform, NgTableParams , $filter) {

    var user = $cookieStore.get('globals')
    const public_cal = "571838cce4b0a280eaf4954a";
    if(user == undefined){
      $state.go("user", {}, {reload: true});
    }
    $scope.tableParams = new NgTableParams({}, {
      getData: function(params) {
        // ajax request to api
        return $http({ method: 'GET', url: 'http://localhost:3111/api/v1/calendar/' + public_cal }).then(
          function success(response) {
            var events = [];
            angular.forEach( response.data, function( value, index ) {
              events.push( EventTransform.toNg(value) );
            });
            //console.log(events);
            return $filter('orderBy')(events, params.orderBy());
          },
          function error( response ) {
            return [];
          })
        ;
      }
    });
    

$scope.clicked_Event_Go = function( id ) {
      $state.go( 'event', { id_event : id } );
    };

  $scope.clicked_findMe = function() {
    var output = document.getElementById("out");

    if (!navigator.geolocation){
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }

    function success(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;
        var map;
        function initMap() {
          map = new google.maps.Map(document.getElementById('map'), {
          center : {lat: latitude, lng: longitude}, //{event.location.cord},
          zoom: 8
          });
        }

        output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

        //var img = new Image();
        //img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";
        output.appendChild(map);
    }

    function error() {
        output.innerHTML = "Unable to retrieve your location";
    }

    output.innerHTML = "<p>Locating…</p>";

    navigator.geolocation.getCurrentPosition(success, error);
  }
}]);
