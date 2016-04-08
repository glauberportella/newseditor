'use strict';

/**
 * @ngdoc service
 * @name newsEditorApp.CheckEditor
 * @description
 * # CheckEditor
 * Service in the newsEditorApp.
 */
angular.module('newsEditorApp')
  .service('CheckEditor', function ($q) {
    var _check = function() {
      var deferred = $q.defer();

      if (Mercury === undefined) {
        deferred.reject('Seu navegador não suporta nosso editor avançado. Atualize.');
      } else {
        deferred.resolve(true);
      }

      return deferred.promise;
    };

    return {
      check: _check
    };
  });
