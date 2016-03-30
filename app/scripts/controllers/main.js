'use strict';

/**
 * @ngdoc function
 * @name newsEditorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newsEditorApp
 */
angular.module('newsEditorApp')
  .controller('MainCtrl', function ($scope, $location, Noticia, CheckEditor) {

    $scope.noticias = Noticia.query();

    $scope.nova = function() {
      CheckEditor.check().then(function() {
        $location.path('/editor');
      }, function(err) {
        window.alert(err);
      });
    };

    $scope.editar = function(noticia) {
      CheckEditor.check().then(function() {
        // pode editar
        $location.path('/editor/'+noticia.id);
      }, function(err) {
        window.alert(err);
      });
    };

    $scope.excluir = function(noticia) {
      if (window.confirm('Deseja realmente excluir a notícia "'+noticia.titulo+'" ?')) {
        Noticia.delete({id: noticia.id}, function() {
          $scope.noticias = Noticia.query();
          window.alert('Notícia excluída com sucesso.');
        }, function(err) {
          window.alert('Erro ao excluir notícia. '+err.statusText);
        });
      }
    };
  });
