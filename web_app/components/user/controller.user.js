'use strict';

calendar.controller( "Controller_User", 
	['$scope', '$rootScope', '$location', 'Session',
	function( $scope,$rootScope,$location,Session ) {
		// reset login status
        Session.ClearCredentials();

        $scope.login = function () {
            $scope.dataLoading = true;
            Session.Login($scope.name, $scope.password, function(response) {
                if(response.password === $scope.password) {
                    var userData = {name: response.name,idUser: response._id, idCal: response.calendar,email: response.email,admin: response.isadmin, active: true};
                    console.log("id of user is: "+ userData.idUser);
                    Session.SetCredentials(userData);
                    $location.path('/calendar');
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
