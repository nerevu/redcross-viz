module.exports = {
  author: {
    name: 'Nerevu Group, LLC',
    twitter: '@nerevu',
    url: '//www.nerevu.com'
  },
  site: {
    sourceCode: '//github.com/nerevu/redcross-viz',
    sourceData: '//github.com/nerevu/redcross-viz/blob/master/app/dev_data/datastore_search.json',
    title: 'El Niño Dashboard',
    subTitle: 'El Niño related Casualties',
    description: 'Deaths and Injuries in Kenya (2015–2016). Hover over the map or graph to see details.',
    url: '//showcase.redcross-viz.nerevu.com',
    type: 'website',
    theme: 'lovely',
    preset: 'album',
    overrides: {},
    items: [
      {title: 'Total Casualties', id: 'where', size: 5},
      {title: 'Casualties over Time', id: 'flood-graph', size: 7}
    ]
  }
};
