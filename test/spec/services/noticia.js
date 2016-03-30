'use strict';

describe('Service: Noticia', function () {

  // load the service's module
  beforeEach(module('newsEditorApp'));

  // instantiate service
  var Noticia;
  beforeEach(inject(function (_Noticia_) {
    Noticia = _Noticia_;
  }));

  it('should do something', function () {
    expect(!!Noticia).toBe(true);
  });

});
