'use strict';

/**
 * @ngdoc function
 * @name newsEditorApp.controller:ConfigmodalCtrl
 * @description
 * # ConfigmodalCtrl
 * Controller of the newsEditorApp
 */
angular.module('newsEditorApp')
  .controller('ConfigCtrl', function ($scope, $uibModalInstance, profile, pages, facebook, FacebookService, Config) {

    var empty = {
      DB_HOST: '',
      DB_NAME: '',
      DB_USER: '',
      DB_PASS: '',
      DB_PORT: 3306,
      FACEBOOK_PROFILE_ID: '',
      FACEBOOK_PAGES: []
    };

    $scope.facebook = facebook;
    $scope.profile = profile;
    $scope.pages = pages;

    $scope.config = angular.copy(empty);

    $scope.salvar = function(config) {
      Config.set('DB_HOST', config.DB_HOST);
      Config.set('DB_NAME', config.DB_NAME);
      Config.set('DB_USER', config.DB_USER);
      Config.set('DB_PASS', config.DB_PASS);
      Config.set('DB_PORT', config.DB_PORT);
      Config.set('FACEBOOK_PROFILE_ID', config.FACEBOOK_PROFILE_ID);

      var fbPages = [];
      config.FACEBOOK_PAGES.forEach(function(page) {
        fbPages.push({
          id: page.id,
          access_token: page.access_token,
          perms: page.perms
        });
      });
      Config.set('FACEBOOK_PAGES', JSON.stringify(config.fbPages));

      Config.sync().then(function() {
        $uibModalInstance.close();
      }).catch(function(err) {
        $scope.errorMsg = err;
      });
    };

    $scope.fechar = function() {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.fbLogin = function() {
      // vincular app a conta facebook para publicação das notícias
      FacebookService.login({
        scope: 'email,public_profile,user_friends,publish_actions,manage_pages,publish_pages',
        return_scopes: true
      }).then(function(response) {
        if (response.status === 'connected') {
          Config.set('FACEBOOK_UID', response.authResponse.userID);
          Config.set('FACEBOOK_ACCESS_TOKEN', response.authResponse.accessToken);
          Config.set('FACEBOOK_SCOPES', response.authResponse.grantedScopes);
          $scope.facebook = true;
          FacebookService.user().then(function(response) {
            $scope.profile = response;
            $scope.config.FACEBOOK_PROFILE_ID = response.id;
            return FacebookService.pages();
          }).then(function(response) {
            $scope.pages = response.data;
          });
        } else if (response.status === 'not_authorized') {
          $scope.facebook = false;
        } else {
          $scope.facebook = false;
        }
      }, function(error) {
        window.alert(error);
      });
    };

  });
