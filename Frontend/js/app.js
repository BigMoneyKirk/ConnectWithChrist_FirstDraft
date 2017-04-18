var app = angular.module('ConnectWithChrist.Frontend', ['ui.router', 'ngSanitize', 'ui.bootstrap', 'ngAnimate', 'ngMaterial', 'ngMessages']);

(function () {
    'use strict';

    app.config(function ($stateProvider, $urlRouterProvider, $qProvider) {
        $urlRouterProvider.otherwise('/login');
        $qProvider.errorOnUnhandledRejections(false);

        $stateProvider
            // first state that application begins on: the login
            .state('/', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'  // I believe what is used in the loginCtrl to grab info about the user from their email
            })
            // if user is an associate, this is the first state they will see
            .state('home', {
                url: '/home',
                templateUrl: 'views/newsfeed.html',
                controller: 'associateWelcomeCtrl'
            })
            /* from the list of exams from associateHome, this state presents the
             * settings for that exam
             */
            .state('profile', {
                url: '/profile',
                templateUrl: 'views/profile.html',
                controller: "profileCtrl"
            })
            // settings for a trainer to create rules for a particular exam template
            .state('settings', {
                url: '/settings',
                templateUrl: 'views/settings.html',
                controller: "associateExamSettingsCtrl"
            })
            // state where associate is taking an exam
            .state('examinprogress', {
                url: '/examinprogress',
                views: {
                    '': {
                        templateUrl: 'views/examnavbar.html'  // adds a nav bar specific with just the timer in the top-right corner
                    }
                    ,
                    'progress@examinprogress': {
                        templateUrl: 'views/associateview_examinprogress.html',
                    }
                },
                controller: 'associateInExamCtrl'
            })
            // if user is a trainer, this is the first state they will see 
            .state('trainerwelcome', {
                url: '/trainerwelcome',
                views: {
                    '': {
                        templateUrl: 'views/trainerview_welcome.html',
                        controller: 'trainerWelcomeCtrl'
                    },
                    'gradebook@trainerwelcome': {
                        templateUrl: 'views/gradebook.html',
                        controller: 'trainerWelcomeCtrl'
                    }
                }
            })
            .state('trainerChangeExistingExam', {
                url: '/trainerChangeExistingExam',
                templateUrl: 'views/trainerview_changeexistingexam.html',
                controller: 'trainerChangeExistingExam'
            })
            .state('examQuestionView', {
                url: '/examQuestionView',
                templateUrl: 'views/examQuestionView.html',
                controller: 'examViewController'
            });

    });

    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    function run($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh: this inject may need more work on keeping user logged in after reload
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();