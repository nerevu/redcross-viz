m = require 'mithril'
helpers = require 'lib/helpers'
utils = require 'lib/utils'

module.exports =
  view: (vnode) ->
    attrs = vnode.attrs
    colors = utils.getColors attrs

    # https://getbootstrap.com/docs/4.4/utilities/colors/#background-color
    albumColor = colors.albumColor or 'white'
    textColor = colors.albumTextColor or helpers.getTextColor albumColor

    m ".album.py-5 bg-#{albumColor} text-#{textColor}",
      m '.container',
        m '.row',
          attrs.items.map (item) ->
            m ".col-md-#{item.size}",
              m ".card.mb-#{item.size}.shadow-sm",
                m '.card-body', [
                  m 'p.card-text', item.title
                  m '.d-flex.justify-content-between.align-items-center',
                    m "##{item.id}"
                ]
