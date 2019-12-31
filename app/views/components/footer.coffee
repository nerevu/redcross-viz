m = require 'mithril'
helpers = require 'lib/helpers'
utils = require 'lib/utils'

year = (new Date()).getFullYear()

module.exports =
  view: (vnode) ->
    attrs = vnode.attrs
    links = attrs.links or []
    colors = utils.getColors attrs

    # https://getbootstrap.com/docs/4.4/utilities/colors/#background-color
    footerColor = colors.footerColor or utils.presets.default.footerColor
    textColor = colors.footerTextColor or helpers.getTextColor footerColor
    linkColor = colors.footerLinkColor or helpers.getLinkColor footerColor

    m "footer.bd-footer small mt-auto bg-#{footerColor} text-#{textColor}",
      m '.container py-3 py-md-5', [
        m 'p.mb-0', [
          "Copyright © #{year} "
          m "a.strong text-#{linkColor}", {
            href: attrs.url
            oncreate: m.route.link
            onupdate: m.route.link
          }, attrs.name
          '. All rights reserved.'
        ]

        if attrs.links?.length
          m 'ul.bd-footer-links mb-0 mt-3', attrs.links?.map (link) ->
            m 'li',
              m "a.strong text-#{linkColor}", {
                href: link.href
                oncreate: m.route.link
                onupdate: m.route.link
              }, link.text
      ]
