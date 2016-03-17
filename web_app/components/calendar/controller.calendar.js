'use strict';

calendar.controller( "Controller_Calendar", [ '$scope', '$uibModal', function( $scope, $uibModal ) {
  $scope.calendarView = 'month';
  $scope.calendarDate = moment();
  $scope.isCellOpen = true;
  $scope.onClick_createEvent = function() {
    var modal = $uibModal.open({
      animation: true,
      templateUrl: 'components/event/edit_event.html',
      controller: 'Controller_Event'
    })
  }
}]);
