'use strict';

calendar.controller( "Controller_Calendar", [ '$scope', function( $scope ) {
  $scope.name = "my calendar";
  $scope.month = "November";
  $scope.day = 11;

  $scope.calendarView = 'month';
  $scope.calendarDate = moment();
  $scope.isCellOpen = true;

}]);
