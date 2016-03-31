'use strict'

describe 'Service: ConfigStore', ->

  # load the service's module
  beforeEach module 'newsEditorApp'

  # instantiate service
  ConfigStore = {}
  beforeEach inject (_ConfigStore_) ->
    ConfigStore = _ConfigStore_

  it 'should do something', ->
    expect(!!ConfigStore).toBe true
