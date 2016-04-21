'use strict';

calendar.controller( "Controller_Navbar", function( $scope, $cookieStore ) {
  	$scope.name = $cookieStore.get('globals').currentUser.name;
});
