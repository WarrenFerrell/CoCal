var calendar = angular.module( "calendar", [ 'ui.router', 'mwl.calendar', 'ui.bootstrap','ngCookies',  'google.places' ]);

calendar.config( function( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/user' );

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

    .state('create_event', {
      url: '/create',
      templateUrl: 'components/event/edit_event.html',
      controller: 'Controller_Event_New'
    })

    .state('event', {
      url: '/event/{id_event}',
      templateUrl: 'components/event/view_event.html',
      controller: 'Controller_Event_View'
    })

    .state('group', {
      url: '/group',
      templateUrl: 'components/groups/group_meta.html',
      controller: 'Controller_Group_Meta'
    })

    .state('group.new', {
      url: '/new',
      templateUrl: 'components/groups/group_new.html',
      controller: 'Controller_Group_New'
    })

    .state('group.id', {
      url: '/{id_group}',
      templateUrl: 'components/groups/group_view.html',
      controller: 'Controller_Group'
    })

    .state('user', {
      url: '/user',
      templateUrl: 'components/user/user.html',
      controller: 'Controller_User'
    })
	  .state('register',{
      url: '/register',
      templateUrl: 'components/user/register.html',
      controller: 'Controller_Register'
    })
	.state('notifications', {
		url:'/notifications',
		templateUrl: 'components/notifications/notifications.html',
		controller: 'Controller_Notifications'
	})
  .state('find_events', {
        url:'/find_events',
        templateUrl: 'components/find_events/list_events.html',
        controller: 'Controller_Find_Events'
    })
  function run($state,$cookieStore){
    //keep user data stored even if browser is refreshed
    var user = $cookieStore.get('globals')
    if(user == undefined){
      $state.go("user", {}, {reload: true});
    }
  }
});

calendar.config( function(calendarConfig) {
    calendarConfig.dateFormatter = 'angular'; //use either moment or angular to format dates on the calendar. Default angular. Setting this will override any date formats you have already set.
    calendarConfig.displayAllMonthEvents = true; //This will display all events on a month view even if they're not in the current month. Default false.
    // calendarConfig.displayEventEndTimes = true; //This will display event end times on the month and year views. Default false.
    // calendarConfig.showTimesOnWeekView = true; //Make the week view more like the day view, with the caveat that event end times are ignored.
  });

