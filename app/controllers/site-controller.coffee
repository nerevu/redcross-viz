m = require 'mithril'
stream = require 'mithril/stream'

config = require 'config'
devconfig = require 'devconfig'
helpers = require 'lib/helpers'
utils = require 'lib/utils'

module.exports = class Controller
  constructor: (attrs) ->
    @loaded = stream false
    @ready = stream false
    @page = stream attrs.page

    @collections = {}

    @head = document.getElementsByTagName('head')[0]
    @body = document.getElementsByTagName('body')[0]

  update: (attrs) => @page attrs.page

  populate: =>
    Object.keys(@collections).forEach (name) =>
      collection = @collections[name]

      if collection.list
        collection.populateListBy?()

        if collection.populate
          collection.populate @collections
          collection.populated = true

  addErrorHandler: ->
    window.addEventListener 'error', (event) ->
      if event
        event.preventDefault()
        console.error event.error or event.message

  setContainerColor: ->
    colors = utils.getColors config.site
    containerColor = colors.albumColor or utils.presets.default.albumColor
    container = document.getElementById 'container'
    helpers.addClass container, "bg-#{containerColor}"
