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
    'ngTouch'
  ])
  .constant('apiBaseUrl', 'http://localhost:8000/api')
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
  }).run(function(ConfigStorage) {
    // load configuration
    ConfigStorage.refresh();
  });
