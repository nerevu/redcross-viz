m = require 'mithril'
helpers = require 'lib/helpers'
utils = require 'lib/utils'

module.exports =
  view: (vnode) ->
    attrs = vnode.attrs
    colors = utils.getColors attrs

    # https://getbootstrap.com/docs/4.4/utilities/colors/#background-color
    jumboColor = colors.jumboColor or attrs.mode or 'light'
    textColor = colors.jumboTextColor or helpers.getTextColor jumboColor
    colors = "bg-#{jumboColor} text-#{textColor}"

    m ".jumbotron jumbotron-fluid py-3 py-md-5 mb-0 #{colors}",
      m '.container', [
        m 'h1.display-4 fw-300', attrs.subTitle
        m 'p.lead', attrs.description
      ]
