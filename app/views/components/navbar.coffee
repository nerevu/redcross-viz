m = require 'mithril'
helpers = require 'lib/helpers'
utils = require 'lib/utils'

module.exports =
  view: (vnode) ->
    attrs = vnode.attrs
    colors = utils.getColors attrs

    # https://getbootstrap.com/docs/4.4/utilities/colors/#background-color
    navbarColor = colors.navbarColor or utils.presets.default.navbarColor
    navbarMode = helpers.getModeColor navbarColor

    m "nav.navbar fixed-top navbar-#{navbarMode} bg-#{navbarColor} shadow-sm",
      m 'div.container.d-flex.justify-content-between',
        m '.navbar-brand.d-flex.align-items-center',
          m 'span', attrs.title
