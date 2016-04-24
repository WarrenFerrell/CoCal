'use strict';

calendar.controller( "Controller_Navbar", function( $scope, $cookieStore, $rootScope) {
	var user = $cookieStore.get('globals');
	if(user == undefined){
  		$scope.name = "Login";
	}
	else{
		$scope.name = user.currentUser.name;
	}
});
