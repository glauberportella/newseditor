'use strict';

/**
 * @ngdoc function
 * @name newsEditorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newsEditorApp
 */
angular.module('newsEditorApp')
  .controller('MainCtrl', function ($scope, $location, $uibModal, Noticia, CheckEditor, ConfigStorage, FacebookService) {

    /**
     * Listen to Config loaded event
     */
    $scope.$on('config:loaded', function() {
      $scope.dominio = ConfigStorage.get('DOMAIN');
    });

    /**
     * Listen to Facebook login status changes
     */
    $scope.$on('facebook:login_status', function(response) {
      if (response.status === 'connected') {
        ConfigStorage.set('FACEBOOK_UID', response.authResponse.userID);
        ConfigStorage.set('FACEBOOK_ACCESS_TOKEN', response.authResponse.accessToken);
        $scope.facebook = true;
      } else if (response.status === 'not_authorized') {
        $scope.facebook = false;
      } else {
        $scope.facebook = false;
      }
    });

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

    $scope.fbLogin = function() {
      // vincular app a conta facebook para publicação das notícias
      FacebookService.login({
        scope: 'email,public_profile,user_friends,publish_actions,manage_pages,publish_pages',
        return_scopes: true
      }).then(function() {
        var profile = {},
            pages = [];
        // exibir configuração para escolher se vai publicar apenas no perfil principal
        // ou nas páginas que o usuário gerencia, exibir listagem das páginas
        FacebookService.user().then(function(response) {
          profile = response;
          return FacebookService.pages();
        }).then(function(response) {
          response.data.forEach(function(page) {
            if (-1 !== page.perms.indexOf('CREATE_CONTENT')) {
              pages.push(page);
            }
          });
          // open modal for configuration
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/config.html',
            controller: 'ConfigModalCtrl',
            resolve: {
              profile: function() {
                return profile;
              },
              pages: function () {
                return pages;
              }
            }
          });
        });
      }, function(error) {
        window.alert(error);
      });
    };
  });
