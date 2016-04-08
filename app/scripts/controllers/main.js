'use strict';

/**
 * @ngdoc function
 * @name newsEditorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newsEditorApp
 */
angular.module('newsEditorApp')
  .controller('MainCtrl', function ($scope, $location, $uibModal, $window, Noticia, Config) {

    /**
     * Listen to Config loaded event
     */
    $scope.dominio = Config.get('DOMAIN');

    $scope.$on('config:loaded', function() {
      $scope.dominio = Config.get('DOMAIN');
    });

    $scope.noticias = Noticia.query();

    $scope.nova = function() {
      $location.path('/editor');
    };

    $scope.editar = function(noticia) {
      // pode editar
      $location.path('/editor/'+noticia.id);
    };

    $scope.excluir = function(noticia) {
      if ($window.confirm('Deseja realmente excluir a notícia "'+noticia.titulo+'" ?')) {
        Noticia.delete({id: noticia.id}, function() {
          $scope.noticias = Noticia.query();
          $window.alert('Notícia excluída com sucesso.');
        }, function(err) {
          $window.alert('Erro ao excluir notícia. '+err.statusText);
        });
      }
    };

    $scope.config = function() {
      Config.open().then(function(modalInstance) {
        modalInstance.result.then(function() {
          // reload configurations and news
          Config.load().then(function() {
            $scope.noticias = Noticia.query();
          });
        });
      });
    };
  });
