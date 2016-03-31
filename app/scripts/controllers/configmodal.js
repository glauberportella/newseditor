'use strict';

/**
 * @ngdoc function
 * @name newsEditorApp.controller:ConfigmodalCtrl
 * @description
 * # ConfigmodalCtrl
 * Controller of the newsEditorApp
 */
angular.module('newsEditorApp')
  .controller('ConfigModalCtrl', function ($scope, $uibModalInstance, profile, pages) {

    $scope.profile = profile;
    $scope.pages = pages;

    $scope.salvar = function(config) {
      $uibModalInstance.close();
    };

    $scope.fechar = function() {
      $uibModalInstance.dismiss('cancel');
    };

  });
