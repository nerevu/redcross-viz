m = require 'mithril'

module.exports =
  view: (vnode) ->
    attrs = vnode.attrs

    m 'button.btn.btn-primary', {
      'type': 'button'
      'disabled': ''
    },
      m 'span.spinner-border.spinner-border-sm', {
        'role': 'status'
        'aria-hidden': 'true'
      }, 'Loading...'

