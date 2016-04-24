'use strict';

calendar.controller( "Controller_User", 
	['$state','$scope', '$rootScope', '$location', 'Session',
	function($state,$scope,$rootScope,$location,Session ) {
		// reset login status
        Session.ClearCredentials();

        $scope.login = function () {
            $scope.dataLoading = true;
            Session.Login($scope.name, $scope.password, function(response) {
                if(response.password === $scope.password) {
                    var userData = {name: response.name,idUser: response._id, idCal: response.calendar,email: response.email,admin: response.isadmin, active: true};
                    Session.SetCredentials(userData);
                    $state.go("calendar", {}, {reload: true});
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                    console.log("Error logging in")
                }
            });
        };
    }]);
  // $scope.name = "justin";
  // $scope.email = "test@example.com";
  // $scope.password = "nopassword";
  // $scope.isadmin = false;
// });
