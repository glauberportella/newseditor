'use strict';

/**
 * @ngdoc function
 * @name newsEditorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newsEditorApp
 */
angular.module('newsEditorApp')
  .controller('MainCtrl', function ($scope, $location, $uibModal, $window, Noticia, CheckEditor, Config) {

    /**
     * Listen to Config loaded event
     */
    $scope.$on('config:loaded', function() {
      $scope.dominio = Config.get('DOMAIN');
    });

    $scope.noticias = Noticia.query();

    $scope.nova = function() {
      CheckEditor.check().then(function() {
        $location.path('/editor');
      }, function(err) {
        $window.alert(err);
      });
    };

    $scope.editar = function(noticia) {
      CheckEditor.check().then(function() {
        // pode editar
        $location.path('/editor/'+noticia.id);
      }, function(err) {
        $window.alert(err);
      });
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
