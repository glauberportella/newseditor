'use strict';

/**
 * @ngdoc service
 * @name newsEditorApp.Auth
 * @description
 * # Auth
 * Service in the newsEditorApp.
 */
angular.module('newsEditorApp')
  .service('FacebookService', function ($q, Utils) {

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

    /**
     * Publish news to user status or page status
     */
    var _publish = function(noticia, profileId, pages, userAccessToken, domain, protocol) {
      var deferred = $q.defer();

      var responses = [];
      var errors = [];

      // generate news link
      protocol = protocol || 'http';
      var titulo = Utils.slugify(noticia.social_titulo || noticia.titulo);
      var newsLink = protocol+'://'+domain+'/api/share/noticia/'+noticia.id+'/'+titulo;

      // publish to user status
      if (profileId !== '') {
        _api('/'+profileId+'/feeds', 'POST', { link: newsLink, access_token: userAccessToken }).then(function(response) {
          responses.push({ type: 'profile', id: profileId, response: response});
        }, function(error) {
          errors.push({ type: 'profile', id: profileId, error: error });
        });
      }

      // publish to pages status
      if (pages.length) {
        angular.forEach(pages, function(page) {
          _api('/'+page.id+'/feeds', 'POST', { link: newsLink, access_token: page.access_token }).then(function(response) {
            responses.push({ type: 'page', id: page.id, response: response});
          }, function(error) {
            errors.push({ type: 'page', id: page.id, error: error});
          });
        });
      }

      if (errors.length) {
        deferred.reject(errors);
      } else {
        deferred.resolve(responses);
      }

      return deferred.promise;
    };

    return {
      api: _api,
      getLoginStatus: _getLoginStatus,
      login: _login,
      pages: _pages,
      user: _user,
      publish: _publish
    };

  });
