m = require 'mithril'
helpers = require 'lib/helpers'
utils = require 'lib/utils'

module.exports =
  view: (vnode) ->
    attrs = vnode.attrs
    colors = utils.getColors attrs

    # https://getbootstrap.com/docs/4.4/utilities/colors/#background-color
    if colors.navbarColor
      navbarColor = colors.navbarColor
    else if attrs.mode is 'dark'
      navbarColor = 'light'
    else
      navbarColor = 'dark'

    navbarMode = helpers.getModeColor navbarColor

    m "nav.navbar fixed-top navbar-#{navbarMode} bg-#{navbarColor} shadow-sm",
      m 'div.container.d-flex.justify-content-between',
        m '.navbar-brand.d-flex.align-items-center',
          m 'span', attrs.title
