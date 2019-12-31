m = require 'mithril'
JumboTron = require './components/jumbotron'
Album = require './components/album'

config = require 'config'
helpers = require 'lib/helpers'
author = config.author

module.exports = (vnode, attrs) ->
  ctrl = vnode.state.ctrl
  attrs = Object.assign attrs or {}, vnode.attrs
  site = config.site

  m 'main', {'role': 'main'}, [
    m JumboTron, site
    m Album, Object.assign site
  ]
