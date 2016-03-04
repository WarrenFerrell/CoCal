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
        },
        'group_view@group': {
          templateUrl: 'components/groups/group_view.html',
          controller: function() {

          }
        },
        'calendar@group': {
          templateUrl: 'components/calendar/calendar.html',
          controller: 'Controller_Calendar'
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
      templateUrl: 'components/event/event.html',
      controller: 'Controller_Event'
    })
});

calendar.run(($rootScope) => {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});
