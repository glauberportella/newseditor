'use strict';

/**
 * @ngdoc function
 * @name newsEditorApp.controller:EditorCtrl
 * @description
 * # EditorCtrl
 * Controller of the newsEditorApp
 */
angular.module('newsEditorApp')
  .controller('EditorCtrl', function ($scope, $location, $timeout, $routeParams, CheckEditor, Noticia, fileReader, FacebookService) {
    var empty = {
      titulo: 'Título da notícia',
      texto: 'Conteúdo da noticia aqui: copiar e colar, digitar, etc.',
      social_imagem: '',
      social_titulo: '',
      social_descricao: '',
      data_noticia: new Date()
    };

    var limparForm = function() {
      $scope.noticia = angular.copy(empty);
      $scope.noticiaForm.$setPristine();
      $scope.noticiaForm.$setUntouched();
    };

    // show editor
    CheckEditor.check().then(function() {

      window.Mercury.trigger('toggle:interface');
      window.Mercury.trigger('reinitialize');

      // save function
      window.Mercury.PageEditor.prototype.save = function() {
        var data = this.serialize();
        var noticia = {
          titulo: data.noticiaTitulo.value,
          texto: data.noticiaTexto.value,
          data_noticia: $scope.noticia.data_noticia,
          social_titulo: $scope.noticia.social_titulo,
          social_descricao: $scope.noticia.social_descricao,
          social_imagem: $scope.noticia.social_imagem
        };
        $scope.salvar(noticia);
      };

      if ($routeParams.id) {
        var noticia = Noticia.get({id: $routeParams.id}, function() {
          noticia.data_noticia = new Date(noticia.data_noticia);
          $scope.noticia = noticia;
        });
      } else {
        $scope.noticia = angular.copy(empty);
      }
    }, function() {
      window.alert('Por algum motivo o editor não foi carregado, tente atualizar a página.');
    });

    $scope.salvar = function(noticia) {
      var resource = new Noticia(noticia);
      resource.$save(function() {
        limparForm();
        window.Mercury.trigger('toggle:interface');
        $location.path('/');
        $timeout(function() {
          window.alert('Notícia salva com sucesso.');
        }, 1000);

        if (noticia.social_enviar) {
          FacebookService.publish(noticia);
        }
      }, function() {
        window.alert('Erro ao salvar notícia, tente novamente mais tarde.');
      });
    };

    $scope.cancelar = function() {
      limparForm();
      window.Mercury.trigger('toggle:interface');
      $location.path('/');
    };

    $scope.getFile = function () {
      var allowed = new Array('image/jpeg', 'image/png', 'image/gif');
      if (-1 === allowed.indexOf($scope.file.type)) {
        window.alert('Arquivo não suportado. Selecione apenas arquivos de imagem JPG, PNG ou GIF.');
      } else {
        fileReader.readAsDataUrl($scope.file, $scope).then(function(result) {
          $scope.noticia.social_imagem = result;
        });
      }
    };
  });
