'use strict';

calendar.controller( "Controller_Register", 
    ['$scope', '$rootScope', '$location', 'Session',
    function( $scope,$rootScope,$location,Session ) {
        $scope.Register = function() {
            $scope.dataLoading = true;
            // console.log("name: " + $scope.name);
            // console.log("password: "+ $scope.password);
            // console.log("email: "+ $scope.email);
            // console.log($scope.isAdmin);
            var user = {
                name: $scope.name, 
                password: $scope.password,
                email: $scope.email,
                isAdmin: $scope.isAdmin
            }

            Session.createUser(user, function(response){
                if(response.name == user.name){
                    $location.path('/user');
                }
            });

        }
    }]);