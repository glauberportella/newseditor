'use strict';

/**
 * @ngdoc function
 * @name newsEditorApp.controller:ConfigmodalCtrl
 * @description
 * # ConfigmodalCtrl
 * Controller of the newsEditorApp
 */
angular.module('newsEditorApp')
  .controller('ConfigCtrl', function ($scope, $window, $uibModalInstance, profile, pages, facebook, userConfig, FacebookService, Config) {

    $scope.facebook = facebook;
    $scope.profile = profile;
    $scope.pages = pages;
    // config injetada no modal Config atraves da opcao resolve de $uibModal.open
    $scope.config = userConfig;

    $scope.salvar = function(config) {
      var domain = config.DOMAIN.replace(/https?:\/\//i, '');
      Config.set('DOMAIN', domain);
      Config.set('DB_HOST', config.DB_HOST);
      Config.set('DB_NAME', config.DB_NAME);
      Config.set('DB_USER', config.DB_USER);
      Config.set('DB_PASS', config.DB_PASS);
      Config.set('DB_PORT', config.DB_PORT);

      Config.set('FACEBOOK_PROFILE_ID', config.FACEBOOK_PROFILE_ID.toString());

      if (config.FACEBOOK_PAGES) {
        Config.set('FACEBOOK_PAGES', JSON.stringify(config.FACEBOOK_PAGES));
      }

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
        $window.alert(error);
      });
    };

    $scope.testarDb = function(config) {
      $scope.infoMsg = 'Testando...';
      // try to connect on db
      Config.testDb(config.DB_HOST, config.DB_PORT, config.DB_NAME, config.DB_USER, config.DB_PASS)
        .then(function(response) {
          if (response.success) {
            $scope.infoMsg = false;
            $scope.errorMsg = false;
            $scope.successMsg = response.message;
          } else {
            $scope.infoMsg = false;
            $scope.successMsg = false;
            $scope.errorMsg = response.message;
          }
        })
        .catch(function(err) {
          $scope.infoMsg = false;
          $scope.successMsg = false;
          $scope.errorMsg = err;
        });
    };

  });
