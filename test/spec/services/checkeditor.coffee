'use strict'

describe 'Service: CheckEditor', ->

  # load the service's module
  beforeEach module 'newsEditorApp'

  # instantiate service
  CheckEditor = {}
  beforeEach inject (_CheckEditor_) ->
    CheckEditor = _CheckEditor_

  it 'should do something', ->
    expect(!!CheckEditor).toBe true
