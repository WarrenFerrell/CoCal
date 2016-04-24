// Reference: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation#Geolocation_Live_Example

'use strict';

calendar.controller( "Controller_Find_Events", [ '$state','$scope', '$http', '$cookieStore', 'EventTransform', function( $state,$scope, $http, $cookieStore, EventTransform ) {
    var user = $cookieStore.get('globals')
    if(user == undefined){
      $state.go("user", {}, {reload: true});
    }
    $http.get( 'http://localhost:3111/api/v1/calendar/' + $cookieStore.get('globals').currentUser.id_calendar )
    .success( function(response) {
      $scope.group = response;
      console.log( response );
    })
    .error( function() {
      console.log( "error" );
    })
  ;
  $scope.calendarDate = moment();

  $scope.event_clicked_findMe = function() {
    var output = document.getElementById("out");

    if (!navigator.geolocation){
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }

    function success(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;

        output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

        // var img = new Image();
        // img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";
        // output.appendChild(img);
    }

    function error() {
        output.innerHTML = "Unable to retrieve your location";
    }

    output.innerHTML = "<p>Locating…</p>";

    navigator.geolocation.getCurrentPosition(success, error);
  }
}]);
