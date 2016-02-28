var calendar = angular.module( "calendar", [ 'ui.router' ]);

calendar.config( function( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'components/home/landing.html',
      controller: 'Controller_Landing'
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
      url: '/event',
      templateUrl: 'components/event/event.html',
      controller: 'Controller_Event'
    })
});

calendar.run(($rootScope) => {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});
