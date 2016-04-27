'use strict';

calendar.controller( "Controller_Navbar", function( $scope, $cookieStore, $rootScope) {
  $scope.updateUser = function() {
    var user = $cookieStore.get('globals');
    if(user == undefined){
        $scope.name = "Login";
    }
    else{
      $scope.name = user.currentUser.name;
    }
  };

  $scope.updateUser();

  $scope.$on('userUpdate', function(event, data) { $scope.updateUser(); });
});
