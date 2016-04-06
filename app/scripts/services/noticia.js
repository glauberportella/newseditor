'use strict';

/**
 * @ngdoc factory
 * @name newsEditorApp.Noticia
 * @description
 * # Noticia
 * Service in the newsEditorApp.
 */
angular.module('newsEditorApp')
  .factory('Noticia', function ($resource, apiBaseUrl) {
    return $resource(apiBaseUrl+'/noticias/:id', null, {
      update: {
        method: 'PUT'
      }
    });
  });
