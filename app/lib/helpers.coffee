m = require 'mithril'

config = require 'config'
devconfig = require 'devconfig'

lightModeColors = ['light', 'white', 'transparent']

remove = (orginal, toRemove) ->
  regex = "(^|\\b)#{toRemove.split(' ').join('|')}(\\b|$)"
  orginal.replace(new RegExp(regex, 'gi'), ' ')

addClass = (el, className) ->
  if el.classList and not el.classList.contains(className)
    el.classList.add(className)
  else if el.className.indexOf(className) is -1
    el.className += " #{className}"

removeClass = (el, className) ->
  if el.classList and el.classList.contains(className)
    el.classList.remove className
  else if el.className.indexOf(className) is -1
    el.className = remove el.className, className

replaceClass = (el, oldClassName, newClassName) ->
  removeClass el, oldClassName
  addClass el, newClassName

module.exports =
  addClass: addClass
  removeClass: removeClass
  replaceClass: replaceClass
  log: console.log

  hasClass: (el, className) ->
    if el.classList
      el.classList.contains(className)
    else
      el.className is className

  addMeta: (head, key, value, keyType='name') ->
    meta = document.createElement 'meta'
    meta.setAttribute keyType, key
    meta.setAttribute 'content', value
    head.appendChild meta

  updateMeta: (key, value, keyType='name') ->
    if keyType is 'name'
      meta = document.getElementsByName(key)[0]
    else if keyType is 'property'
      _.forEach document.getElementsByTagName('meta'), (el) ->
        if el?.attributes?.property?.value?.includes key
          meta = el

    meta?.setAttribute 'content', value

  capitalize: (text) -> "#{text[0].toUpperCase()}#{text.substring 1}"
  getRandomIndex: (items) -> Math.floor(Math.random() * items.length)

  isVisible: (name, isClass) ->
    if isClass
      el = document.getElementsByClassName(name)[0]
      el?.classList?.contains name
    else
      Boolean(document.getElementById(name)?.id)

  getModels: (ids, collection) ->
    models = []

    ids.forEach (id) ->
      model = collection.get id

      if model
        models.push model

    models

  uniqSort: (array) -> _.sortedUniq _.sortBy array
  replaceUrl: (old, _new) ->
    m.route.set m.route.get().replace(old, _new), null, replace: true

  getHidden: (value, visible) ->
    if value not in visible.xl
      hiddenAll
    else if value not in visible.lg
      hiddenLG
    else if value not in visible.md
      hiddenMD
    else if value not in visible.sm
      hiddenSM
    else if value not in visible.xs
      hiddenXS
    else
      ''

  positions: ['1st', '2nd', '3rd', '4th']
  getTextColor: (color) ->
    if color in lightModeColors then 'dark' else 'light'

  getModeColor: (color) ->
    if color in lightModeColors then 'light' else 'dark'

  getLinkColor: (color) ->
    if color in lightModeColors then 'primary' else 'warning'
