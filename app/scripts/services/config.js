'use strict';

/**
 * @ngdoc service
 * @name newsEditorApp.Config
 * @description
 * # Config
 * Service in the newsEditorApp.
 */
angular.module('newsEditorApp')
  .service('Config', function ($resource, $rootScope, $q, $http, $uibModal, apiBaseUrl, FacebookService) {

    var _data = {};

    // Chaves que possuem valor representando objeto JSON
    // deve ser usado JSON.parse no load()
    var _valueAsJson = ['FACEBOOK_PAGES'];

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
      return _data[key];
    };

    /**
     * Set a config key value
     */
    var _set = function(key, value) {
      _data[key] = value;
      return value;
    };

    /**
     * Load all config from API in _data array
     */
    var _load = function() {
      var deferred = $q.defer();

      _data = {};
      var values = _api.query(function() {
        values.forEach(function(item) {
          if (-1 === _valueAsJson.indexOf(item.nome)) {
            _data[item.nome] = item.valor;
          } else {
            _data[item.nome] = JSON.parse(item.valor);
          }
        });
        deferred.resolve(_data);
        $rootScope.$broadcast('config:loaded', {config: _data});
      });

      return deferred.promise;
    };

    /**
     * Sync config values in _data array with API
     */
    var _sync = function() {
      return _api.batchSave(_data).$promise;
    };

    /**
     * Open Config modal
     */
    var _openModal = function() {
      var deferred = $q.defer();

      var fbUid = _get('FACEBOOK_UID') || '';
      var fbAccessToken = _get('FACEBOOK_ACCESS_TOKEN') || '';
      var modal = null;

      if (fbUid.length > 0 && fbAccessToken.length > 0) {
        var profile = {},
            pages = [];
        FacebookService.user().then(function(response) {
          profile = response;
          return FacebookService.pages();
        }).then(function(response) {
          response.data.forEach(function(page) {
            if (-1 !== page.perms.indexOf('CREATE_CONTENT')) {
              pages.push({
                id: page.id,
                name: page.name,
                perms: page.perms
              });
            }
          });
          // abrir modal de configuracao
          modal = $uibModal.open({
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
              },
              userConfig: function() {
                return _data;
              }
            }
          });
          deferred.resolve(modal);
        });
      } else {
        // abrir modal de configuracao
        modal = $uibModal.open({
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
            },
            userConfig: function() {
              return _data;
            }
          }
        });
        deferred.resolve(modal);
      }

      return deferred.promise;
    };

    var _testDb = function(host, port, dbname, dbuser, dbpass) {
      var deferred = $q.defer();

      $http.post(apiBaseUrl+'/testdb', {
        host: host,
        port: port,
        db: dbname,
        user: dbuser,
        pass: dbpass
      }).then(function(response) {
        deferred.resolve(response.data);
      }, function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    };

    return {
      api: _api,
      set: _set,
      get: _get,
      load: _load,
      sync: _sync,
      open: _openModal,
      testDb: _testDb
    };
  });
