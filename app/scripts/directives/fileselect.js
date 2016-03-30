'use strict';

/**
 * @ngdoc directive
 * @name newsEditorApp.directive:FileSelect
 * @description
 * # FileSelect
 */
angular.module('newsEditorApp')
  .directive('ngFileSelect', function () {
    return {
      link: function($scope,el) {
        el.bind('change', function(e){
          $scope.file = (e.srcElement || e.target).files[0];
          $scope.getFile();
        });
      }
    };
  });
