'use strict';

describe('Service: ConfigStorage', function () {

  // load the service's module
  beforeEach(module('newsEditorApp'));

  // instantiate service
  var ConfigStorage;
  beforeEach(inject(function (_ConfigStorage_) {
    ConfigStorage = _ConfigStorage_;
  }));

  it('should do something', function () {
    expect(!!ConfigStorage).toBe(true);
  });

});
