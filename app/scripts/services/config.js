'use strict';

/**
 * @ngdoc service
 * @name newsEditorApp.Config
 * @description
 * # Config
 * Service in the newsEditorApp.
 */
angular.module('newsEditorApp')
  .service('Config', function ($resource, apiBaseUrl) {
    return $resource(apiBaseUrl+'/config/:key', null, {
      update: {
        method: 'PUT'
      }
    });
  });
