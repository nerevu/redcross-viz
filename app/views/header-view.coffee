m = require 'mithril'
Navbar = require './components/navbar'

config = require 'config'
helpers = require 'lib/helpers'

module.exports = (vnode, attrs) ->
  ctrl = vnode.state.ctrl
  attrs = Object.assign attrs or {}, vnode.attrs

  m 'header', m Navbar, config.site
