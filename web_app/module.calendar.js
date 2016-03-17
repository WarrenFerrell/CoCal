var calendar = angular.module( "calendar", [ 'ui.router', 'mwl.calendar', 'ui.bootstrap' ]);

calendar.config( function( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'components/home/home.html',
      controller: 'Controller_Home'
    })

    .state('calendar', {
      url: '/calendar',
      templateUrl: 'components/calendar/calendar.html',
      controller: 'Controller_Calendar'
    })

    .state('group', {
      url: '/group',
      views: {
        '': {
          templateUrl: 'components/groups/group_meta.html',
          controller: 'Controller_Group_Meta'
        }
      }
    })

    .state('group.id', {
      url: '/{id_group}',
      views: {
        '': {
          template: ''
        },
        'group_view': {
          templateUrl: 'components/groups/group_view.html',
          controller: 'Controller_Group'
        }
      }
    })

    .state('user', {
      url: '/user',
      templateUrl: 'components/user/user.html',
      controller: 'Controller_User'
    })

    .state('home.user', {
      url: '/user',
      templateUrl: 'components/user/user.html',
      controller: 'Controller_User'
    })

    .state('home.calendar', {
      url: '/calendar',
      templateUrl: 'components/calendar/calendar.html',
      controller: 'Controller_Calendar'
    })

    .state('home.event', {
      url: '/event/{id_event}',
      templateUrl: 'components/event/edit_event.html',
      controller: 'Controller_Event'
    })
});

calendar.config(function(calendarConfig) {
    console.log(calendarConfig); //view all available config
    calendarConfig.dateFormatter = 'angular'; //use either moment or angular to format dates on the calendar. Default angular. Setting this will override any date formats you have already set.
    calendarConfig.displayAllMonthEvents = true; //This will display all events on a month view even if they're not in the current month. Default false.
    calendarConfig.displayEventEndTimes = true; //This will display event end times on the month and year views. Default false.
    calendarConfig.showTimesOnWeekView = true; //Make the week view more like the day view, with the caveat that event end times are ignored.
  });

calendar.run(($rootScope) => {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});
