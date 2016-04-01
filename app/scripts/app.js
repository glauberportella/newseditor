'use strict';

/**
 * @ngdoc overview
 * @name newsEditorApp
 * @description
 * # newsEditorApp
 *
 * Main module of the application.
 */
angular
  .module('newsEditorApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'checklist-model'
  ])
  .constant('apiBaseUrl', 'http://localhost:8000/api')
  .constant('fbAppId', '500657106808675')
  .constant('fbTestAppId', '500658513475201')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/editor/:id?', {
        templateUrl: 'views/editor.html',
        controller: 'EditorCtrl',
        controllerAs: 'editor'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function($window, $rootScope, Config, fbTestAppId, FacebookService) {
    // load configuration
    Config.load();

    $window.fbAsyncInit = function() {
      // Executed when the SDK is loaded
      FB.init({
        /*
         The app id of the web app;
         To register a new app visit Facebook App Dashboard
         ( https://developers.facebook.com/apps/ )
        */
        appId: fbTestAppId,
        /*
         Adding a Channel File improves the performance
         of the javascript SDK, by addressing issues
         with cross-domain communication in certain browsers.
        */
        channelUrl: 'channel.html',
        /*
         Set if you want to check the authentication status
         at the start up of the app
        */
        status: true,
        /*
         Enable cookies to allow the server to access
         the session
        */
        cookie: true,
        /* Parse XFBML */
        xfbml: true
      });

      FacebookService.getLoginStatus().then(function(response) {
        $rootScope.$broadcast('facebook:login_status', response);
      });
    };

    // Are you familiar to IIFE ( http://bit.ly/iifewdb ) ?
    (function(d){
      // load the Facebook javascript SDK
      var js,
      id = 'facebook-jssdk',
      ref = d.getElementsByTagName('script')[0];

      if (d.getElementById(id)) {
        return;
      }

      js = d.createElement('script');
      js.id = id;
      js.async = true;
      js.src = "//connect.facebook.net/pt_BR/all.js";

      ref.parentNode.insertBefore(js, ref);
    }(document));
  });
