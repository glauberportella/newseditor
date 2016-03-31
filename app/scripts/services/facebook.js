'use strict';

/**
 * @ngdoc service
 * @name newsEditorApp.Auth
 * @description
 * # Auth
 * Service in the newsEditorApp.
 */
angular.module('newsEditorApp')
  .service('FacebookService', function ($q) {

    /**
     * Facebook login status
     */
    var _getLoginStatus = function() {
      var deferred = $q.defer();

      FB.getLoginStatus(function(response) {
        if (response && !response.error) {
          deferred.resolve(response);
        } else {
          deferred.reject(response.error);
        }
      });

      return deferred.promise;
    };

    /**
     * Main FB OpenGraph API interface
     */
    var _api = function(path, method, params) {
      var deferred = $q.defer();

      method = method || 'get';
      params = params || {};

      FB.api(path, method, params, function(response) {
        if (response && !response.error) {
          deferred.resolve(response);
        } else {
          deferred.reject(response.error);
        }
      });

      return deferred.promise;
    };

    /**
     * Do FB login
     */
    var _login = function(opts) {
      var deferred = $q.defer();

      opts = opts || {};

      FB.login(function(response) {
        if (response && !response.error) {
          if (response.authResponse) {
            deferred.resolve(response);
          } else {
            deferred.reject('Facebook: o usuário cancelou o login ou não autorizou o aplicativo.');
          }
        } else {
          deferred.reject(response.error);
        }
      }, opts);

      return deferred.promise;
    };

    /**
     * Get pages that the user manage
     */
    var _pages = function() {
      return _api('/me/accounts');
    };

    /**
     * Get user profile
     */
    var _user = function() {
      return _api('/me');
    };

    return {
      api: _api,
      getLoginStatus: _getLoginStatus,
      login: _login,
      pages: _pages,
      user: _user
    };

  });
