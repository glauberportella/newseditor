'use strict';

/**
 * @ngdoc service
 * @name newsEditorApp.ConfigStorage
 * @description
 * # ConfigStorage
 * Service in the newsEditorApp.
 */
angular.module('newsEditorApp')
  .service('ConfigStorage', function ($q, $rootScope, Config) {
    var data = {};

    return {
      get: function(key) {
        return data[key];
      },
      set: function(key, value) {
        data[key] = value;
        return value;
      },
      load: function() {
        var deferred = $q.defer();

        data = {};
        var values = Config.query(function() {
          values.forEach(function(item) {
            data[item.nome] = item.valor;
          });
          deferred.resolve(data);
          $rootScope.$broadcast('config:loaded', {config: data});
        });

        return deferred.promise;
      }
    };
  });
