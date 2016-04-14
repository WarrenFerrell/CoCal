'use strict';

calendar.controller( "Controller_User", 
	['$scope', '$rootScope', '$location', 'AuthenticationService',
	function( $scope,$rootScope,$location,AuthenticationService ) {
		// reset login status
        AuthenticationService.ClearCredentials();

        $scope.login = function () {
            $scope.dataLoading = true;
            var userData = {name: $scope.name, password: $scope.password,idUser: $scope.id_user,idCal: $scope.id_calendar,email: $scope.email,admin: $scope,isAdmin}
            AuthenticationService.Login($scope.name, $scope.password, function(response) {
                if(response.success) {
                	console.log("Successful Login!! with: " + $scope.name);
                    // AuthenticationService.SetCredentials(userData);
                    // $location.path('/');
                } else {
                  console.log("unsuccessful login with:" + $scope.name);
                    // $scope.error = response.message;
                    // $scope.dataLoading = false;
                }
            });
        };
    }]);
  // $scope.name = "justin";
  // $scope.email = "test@example.com";
  // $scope.password = "nopassword";
  // $scope.isadmin = false;
// });
