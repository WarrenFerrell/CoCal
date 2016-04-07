'use strict';

calendar.controller( "Controller_Navbar", function( $scope, Session ) {
  $scope.username = Session.name;
});
