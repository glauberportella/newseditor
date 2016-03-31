'use strict';

/**
 * @ngdoc service
 * @name newsEditorApp.ConfigStorage
 * @description
 * # ConfigStorage
 * Service in the newsEditorApp.
 */
angular.module('newsEditorApp')
  .service('ConfigStorage', function (Config) {
    var data = {};

    return {
      get: function(key) {
        return data[key];
      },
      set: function(key, value) {
        data[key] = value;
        return value;
      },
      refresh: function() {
        data = {};
        var values = Config.query(function() {
          values.forEach(function(item) {
            data[item.nome] = item.valor;
          });
        });
      }
    };
  });
