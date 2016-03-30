'use strict';

describe('Directive: FileSelect', function () {

  // load the directive's module
  beforeEach(module('newsEditorApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-file-select></-file-select>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the FileSelect directive');
  }));
});
