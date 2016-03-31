'use strict';

describe('Service: Facebook', function () {

  // load the service's module
  beforeEach(module('newsEditorApp'));

  // instantiate service
  var Facebook;
  beforeEach(inject(function (_FacebookService_) {
    Facebook = _FacebookService_;
  }));

  it('should do something', function () {
    expect(!!Facebook).toBe(true);
  });

});
