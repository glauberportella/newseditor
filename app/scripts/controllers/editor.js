'use strict';

/**
 * @ngdoc function
 * @name newsEditorApp.controller:EditorCtrl
 * @description
 * # EditorCtrl
 * Controller of the newsEditorApp
 */
angular.module('newsEditorApp')
  .controller('EditorCtrl', function ($scope, $rootScope, $location, $timeout, $routeParams, $window, Noticia, fileReader, FacebookService, Config) {
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

    $scope.froalaOptions = {
      toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'quote', 'insertHR', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
      toolbarButtonsSM: ['bold', 'italic', 'fontFamily', 'fontSize', '|', 'color', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'html'],
      toolbarButtonsXS: ['bold', 'italic', 'fontFamily', 'fontSize', '|', 'color', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'html']
    };

    if ($routeParams.id) {
      var noticia = Noticia.get({id: $routeParams.id}, function() {
        noticia.data_noticia = new Date(noticia.data_noticia);
        $scope.noticia = noticia;
        $scope.updating = true;
      });
    } else {
      $scope.noticia = angular.copy(empty);
      $scope.updating = false;
    }

    $scope.salvar = function(noticia) {

      // titulo
      noticia.titulo = angular.element('#noticiaTitulo').html();

      var resource = new Noticia(noticia);

      var successFn = function() {
        limparForm();
        $location.path('/');

        $rootScope.successMsg = 'Notícia salva com sucesso.';
        $timeout(function() {
          $rootScope.successMsg = false;
        }, 3000);

        if (noticia.social_enviar) {
          FacebookService.getLoginStatus().then(function(response) {
            if (response.status === 'connected') {
              Config.set('FACEBOOK_UID', response.authResponse.userID);
              Config.set('FACEBOOK_ACCESS_TOKEN', response.authResponse.accessToken);
              var profileId = Config.get('FACEBOOK_PROFILE_ID');
              var pages = Config.get('FACEBOOK_PAGES');
              var userAccessToken = Config.get('FACEBOOK_ACCESS_TOKEN');
              var domain = Config.get('DOMAIN');
              var protocol = 'http';
              FacebookService.publish(noticia, profileId, pages, userAccessToken, domain, protocol).then(function() {
                $rootScope.successMsg = 'Notícia compartilhada no Facebook.';
                $timeout(function() {
                  $rootScope.successMsg = false;
                }, 3000);
              }, function(errors) {
                $rootScope.errorMsg = 'Ocorreram erros no compartilhamento no Facebook: '+errors.message;
                $timeout(function() {
                  $rootScope.errorMsg = false;
                }, 10000);
              });
            } else {
              FacebookService.login({
                scope: 'email,public_profile,user_friends,publish_actions,manage_pages,publish_pages',
                return_scopes: true
              }).then(function(response) {
                Config.set('FACEBOOK_UID', response.authResponse.userID);
                Config.set('FACEBOOK_ACCESS_TOKEN', response.authResponse.accessToken);
                Config.set('FACEBOOK_SCOPES', response.authResponse.grantedScopes);
                var profileId = Config.get('FACEBOOK_PROFILE_ID');
                var pages = Config.get('FACEBOOK_PAGES');
                var userAccessToken = Config.get('FACEBOOK_ACCESS_TOKEN');
                var domain = Config.get('DOMAIN');
                var protocol = 'http';
                FacebookService.publish(noticia, profileId, pages, userAccessToken, domain, protocol).then(function() {
                  $rootScope.successMsg = 'Notícia compartilhada no Facebook.';
                  $timeout(function() {
                    $rootScope.successMsg = false;
                  }, 3000);
                }, function(errors) {
                  $rootScope.errorMsg = 'Ocorreram erros no compartilhamento no Facebook: '+errors.message;
                  $timeout(function() {
                    $rootScope.errorMsg = false;
                  }, 10000);
                });
              });
            }
          });
        }
      };

      var errorFn = function() {
        $rootScope.errorMsg = 'Erro ao salvar notícia, tente novamente mais tarde.';
        $timeout(function() {
          $rootScope.errorMsg = false;
        }, 3000);
      };

      if ($scope.updating) {
        Noticia.update({id: noticia.id}, noticia).$promise.then(successFn, errorFn);
      } else {
        resource.$save(successFn, errorFn);
      }

    };

    $scope.cancelar = function() {
      limparForm();
      $location.path('/');
    };

    $scope.getFile = function () {
      var allowed = new Array('image/jpeg', 'image/png', 'image/gif');
      if (-1 === allowed.indexOf($scope.file.type)) {
        $window.alert('Arquivo não suportado. Selecione apenas arquivos de imagem JPG, PNG ou GIF.');
      } else {
        fileReader.readAsDataUrl($scope.file, $scope).then(function(result) {
          $scope.noticia.social_imagem = result;
        });
      }
    };
  });
