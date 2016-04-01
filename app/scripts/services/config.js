'use strict';

/**
 * @ngdoc service
 * @name newsEditorApp.Config
 * @description
 * # Config
 * Service in the newsEditorApp.
 */
angular.module('newsEditorApp')
  .service('Config', function ($resource, $rootScope, $q, $uibModal, apiBaseUrl, FacebookService) {

    var data = {};

    // Chaves que possuem valor representando objeto JSON
    // deve ser usado JSON.parse no load()
    var _keysAsJson = ['FACEBOOK_PAGES'];

    /**
     * Resource for API
     */
    var _api = $resource(apiBaseUrl+'/config/:key', null, {
      update: {
        method: 'PUT'
      },
      batchSave: {
        method: 'POST'
      }
    });

    /**
     * Get a config key value
     */
    var _get = function(key) {
      return data[key];
    };

    /**
     * Set a config key value
     */
    var _set = function(key, value) {
      data[key] = value;
      return value;
    };

    /**
     * Load all config from API in data array
     */
    var _load = function() {
      var deferred = $q.defer();

      data = {};
      var values = _api.query(function() {
        values.forEach(function(item) {
          if (-1 === _keysAsJson.indexOf(item.nome)) {
            data[item.nome] = item.valor;
          } else {
            data[item.nome] = JSON.parse(item.valor);
          }
        });
        deferred.resolve(data);
        $rootScope.$broadcast('config:loaded', {config: data});
      });

      return deferred.promise;
    };

    /**
     * Sync config values in data array with API
     */
    var _sync = function() {
      return _api.batchSave(data).$promise;
    };

    /**
     * Open Config modal
     */
    var _openModal = function() {
      var fbUid = _get('FACEBOOK_UID') || '';
      var fbAccessToken = _get('FACEBOOK_ACCESS_TOKEN') || '';

      if (fbUid.length > 0 && fbAccessToken.length > 0) {
        var profile = {},
            pages = [];
        FacebookService.user().then(function(response) {
          profile = response;
          return FacebookService.pages();
        }).then(function(response) {
          response.data.forEach(function(page) {
            if (-1 !== page.perms.indexOf('CREATE_CONTENT')) {
              pages.push(page);
            }
          });
          // abrir modal de configuracao
          $uibModal.open({
            animation: true,
            templateUrl: 'views/config.html',
            controller: 'ConfigCtrl',
            resolve: {
              facebook: function() {
                return true;
              },
              profile: function() {
                return profile;
              },
              pages: function () {
                return pages;
              }
            }
          });
        });
      } else {
        // abrir modal de configuracao
        $uibModal.open({
          animation: true,
          templateUrl: 'views/config.html',
          controller: 'ConfigCtrl',
          resolve: {
            facebook: function() {
              return false;
            },
            profile: function() {
              return null;
            },
            pages: function () {
              return [];
            }
          }
        });
      }
    };

    return {
      api: _api,
      set: _set,
      get: _get,
      load: _load,
      sync: _sync,
      open: _openModal
    };
  });
