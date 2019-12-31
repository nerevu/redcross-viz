m = require 'mithril'
Application = require 'application'
routes = require 'routes'

m.route.prefix ''

location = document.getElementById 'container'
m.route location, '/', routes Application
