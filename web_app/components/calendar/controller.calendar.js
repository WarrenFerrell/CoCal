'use strict';

calendar.controller( "Controller_Calendar", [ '$scope', '$uibModal', function( $scope, $uibModal ) {
  $scope.calendarView = 'month';
  $scope.calendarDate = moment();
  $scope.isCellOpen = true;
}]);
