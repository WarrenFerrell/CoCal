'use strict';

calendar.controller( "Controller_User", 
	['$scope', '$rootScope', '$location', 'AuthenticationService',
	function( $scope,$rootScope,$location,AuthenticationService ) {
		// reset login status
        AuthenticationService.ClearCredentials();

        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.name, $scope.password, function(response) {
                if(response.success) {
                	console.log("Successful Login!! with" + $scope.name);
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $location.path('/');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
    }]);
  // $scope.name = "justin";
  // $scope.email = "test@example.com";
  // $scope.password = "nopassword";
  // $scope.isadmin = false;
// });