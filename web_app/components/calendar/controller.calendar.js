'use strict';

calendar.controller( "Controller_Calendar", [ '$scope', function( $scope ) {
  $scope.calendarView = 'month';
  $scope.calendarDate = moment();
  $scope.isCellOpen = true;
}]);
