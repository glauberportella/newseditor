'use strict';

/**
 * @ngdoc service
 * @name newsEditorApp.Auth
 * @description
 * # Auth
 * Service in the newsEditorApp.
 */
angular.module('newsEditorApp')
  .service('FacebookService', function ($q, $httpParamSerializerJQLike, Utils) {

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

      // generate news link
      protocol = protocol || 'http';
      var titulo = Utils.slugify(noticia.social_titulo || noticia.titulo);
      var newsLink = protocol+'://'+domain+'/api/share/noticia/'+noticia.id+'/'+titulo;

      // publish to user status
      if (profileId !== '') {
        __publishInUserProfile(profileId, { link: newsLink, access_token: userAccessToken }).then(function(response) {
          if (pages.length) {
            __publishInUserPages(pages, {
              access_token: userAccessToken,
              body: {
                link: newsLink
              }
            }, profileId).then(function(response) {
              deferred.resolve(response);
            }, function(error) {
              deferred.reject(error);
            });
          } else {
            deferred.resolve(response);
          }
        }, function(error) {
          deferred.reject(error);
        });
      } else {
        // publish to pages status
        if (pages.length) {
          // get pages ACCESS TOKEN
          __publishInUserPages(pages, {
            access_token: userAccessToken,
            body: {
              link: newsLink
            }
          }).then(function(response) {
            deferred.resolve(response);
          }, function(error) {
            deferred.reject(error);
          });
        }
      }


      return deferred.promise;
    };

    var __publishInUserProfile = function(profileId, params) {
       return _api('/'+profileId+'/feed', 'POST', params);
    };

    var __publishInUserPages = function(pages, params, userId) {
      var deferred = $q.defer();

      userId = userId || 'me';

      _api('/'+userId+'/accounts', 'GET', { access_token: params.access_token }).then(function(response) {
        var fbApiPages = response.data;
        var batch = [];
        angular.forEach(fbApiPages, function(fbp) {
          angular.forEach(pages, function(page) {
            if (fbp.id === page.id) {
              page.access_token = fbp.access_token;
              var body = params.body;
              batch.push({
                method: 'POST',
                relative_url: page.id+'/feed',
                body: $httpParamSerializerJQLike(body)
              });
            }
          });
        });

        if (batch.length) {
          _api('/', 'POST', {
            batch: batch
          }).then(function(response) {
            deferred.resolve(response);
          }, function(error) {
            deferred.reject(error);
          });
        } else {
          deferred.resolve(null);
        }
      }, function(error) {
        deferred.reject(error);
      });

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
