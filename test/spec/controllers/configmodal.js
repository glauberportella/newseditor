'use strict';

describe('Controller: ConfigmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('newsEditorApp'));

  var ConfigmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigmodalCtrl = $controller('ConfigmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigmodalCtrl.awesomeThings.length).toBe(3);
  });
});
