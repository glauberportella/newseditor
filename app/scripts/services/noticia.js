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
      query: {
        isArray: true,
        transformResponse: function(data) {
          var response = angular.fromJson(data);
          return response.items;
        }
      },
      update: {
        method: 'PUT'
      }
    });
  });
