'use strict';

calendar.controller( "Controller_Register", 
    ['$scope', '$rootScope', '$location', 'Session',
    function( $scope,$rootScope,$location,Session ) {
        function Create(user) {
                    var deferred = $q.defer();
         
                    // simulate api call with $timeout
                    $timeout(function () {
                        GetByUsername(user.username)
                            .then(function (duplicateUser) {
                                if (duplicateUser !== null) {
                                    deferred.resolve({ success: false, message: 'Username "' + user.username + '" is already taken' });
                                } else {
                                    var users = getUsers();
         
                                    // assign id
                                    var lastUser = users[users.length - 1] || { id: 0 };
                                    user.id = lastUser.id + 1;
         
                                    // save to local storage
                                    users.push(user);
                                    setUsers(users);
         
                                    deferred.resolve({ success: true });
                                }
                            });
                    }, 1000);
         
                    return deferred.promise;
        }
    };
