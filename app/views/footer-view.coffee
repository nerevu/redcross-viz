m = require 'mithril'
Footer = require './components/footer'

config = require 'config'

module.exports = (vnode, attrs) ->
  ctrl = vnode.state.ctrl
  attrs = Object.assign attrs or {}, vnode.attrs
  site = config.site
  author = config.author
  links = []

  if site.sourceCode
    links.push(href: site.sourceCode, text: 'Source Code')

  if site.sourceData
    links.push(href: site.sourceData, text: 'Data')

  m Footer, Object.assign {links}, author, site
