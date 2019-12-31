m = require 'mithril'
config = require 'config'
helpers = require 'lib/helpers'
header = require './header-view'
main = require './main-view'
footer = require './footer-view'


module.exports = (vnode, attrs) ->
  ctrl = vnode.state.ctrl
  attrs = Object.assign attrs or {}, vnode.attrs

  [
    header vnode
    main vnode
    footer vnode
  ]
