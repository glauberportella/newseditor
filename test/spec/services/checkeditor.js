'use strict';

describe('Service: CheckEditor', function () {

  // load the service's module
  beforeEach(module('newsEditorApp'));

  // instantiate service
  var CheckEditor;
  beforeEach(inject(function (_CheckEditor_) {
    CheckEditor = _CheckEditor_;
  }));

  it('should do something', function () {
    expect(!!CheckEditor).toBe(true);
  });

});
