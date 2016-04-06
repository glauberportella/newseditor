'use strict';

/**
 * @ngdoc service
 * @name newsEditorApp.Utils
 * @description
 * # Utils
 * Service in the newsEditorApp.
 */
angular.module('newsEditorApp')
  .service('Utils', function () {
    var _slugify = function(str) {
      return str.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/&/g, '-e-')         // Replace & with 'e'
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-');        // Replace multiple - with single -
    };

    return {
      slugify: _slugify
    };
  });
