var geography = require("../dev_data/geography.geojson.json")
var datastore_search = require("../dev_data/datastore_search.json")

var config = {
  chartId: "#flood-graph",
  whereId: "#where",
  whereFieldName: "county",
  joinAttribute: "COUNTY_NAM",
  nameAttribute: "COUNTY_NAM",
  geo: geography,
  data: datastore_search,
  counties: ["kiambu", "homa bay", "narok", "other"],
  mapColors: colorbrewer["YlOrRd"][5],
  deathColors: colorbrewer["Reds"][4],
  caseColors: colorbrewer["Blues"][4]
};

var bad = {
  "homabay": "homa bay",
  "elgeiyo marakwet": "elegeyo-marakwet",
  "trans-nzoia": "trans nzoia",
  "tharaka nithi": "tharaka - nithi",
  "garrissa": "garissa",
  "garisssa": "garissa",
  "kiamabu": "kiambu"
};

function generateChoropleth(config, data) {
  var valLookup = genValLookup()
    , nameLookup = genNameLookup(valLookup)
    , chart = dc.choroplethChart(config.whereId)
    , cf = crossfilter(data);

  var dimension = cf.dimension(function(d){
    return d[config.whereFieldName];
  });

  var group = dimension.group()
    , width = $(config.whereId).width()
    , height = $(config.whereId).height();

  chart.width(width).height(height)
    .dimension(dimension)
    .group(group)
    .center([0,0])
    .zoom(0)
    .geojson(config.geo)
    .colors(config.mapColors)
    .colorDomain(d3.extent(_.pluck(data, 'affected')))
    .colorCalculator(function (d, i) {
      value = valLookup[group.all()[i].key]
      if (value){
        return chart.colors()(value);
      } else {
        return '#ccc';
      }
    })
    .featureKeyAccessor(function(feature){
      return feature.properties[config.joinAttribute].toLowerCase();
    }).popup(function(d){
      return nameLookup[d.key] + "\nDeaths and Injuries: " + valLookup[d.key];
    })
    .renderPopup(true);

  dc.renderAll();
  var map = chart.map();
  zoomToGeom(config.geo);

  function zoomToGeom(geom){
    var bounds = d3.geo.bounds(geom);
    map.fitBounds([[bounds[0][1],bounds[0][0]],[bounds[1][1],bounds[1][0]]]);
  }

  function genValLookup(){
    var lookup = {};
    data.forEach(function(d){
      join = d[config.whereFieldName]
      lookup[join] = d.affected;
    });
    return lookup;
  }

  function genNameLookup(valLookup){
    var lookup = {};
    config.geo.features.forEach(function(e){
      join = e.properties[config.joinAttribute].toLowerCase()
      name = String(e.properties[config.nameAttribute])
      lookup[join] = name;

      if (!valLookup[join]) {
        data.push({'county': join})
        valLookup[join] = 0
      }
    });

    return lookup;
  }

  function updateCharts(value) {
    dc.filterAll();
    dc.redrawAll();
  }
}

function generateLineChart(config, data){
  var varNames = d3.keys(data[0].deaths).filter(function (key) {
    return key !== 'Total'
  });

  var seriesDeathArr = [];
  var seriesCaseArr = [];

  varNames.forEach(function (name) {
    var deathValues = data.map(function (d) {
      return {label: d.date, value: +d.deaths[name]};
    });

    var caseValues = data.map(function (d) {
      return {label: d.date, value: +d.affected[name]};
    });

    seriesDeathArr.push({name: name, values: deathValues});
    seriesCaseArr.push({name: name, values: caseValues});
  });

  var deathColor = d3.scale.ordinal().range(config.deathColors);
  var caseColor = d3.scale.ordinal().range(config.caseColors);
  var margin = {top: 20, right: 100, bottom: 25, left: 25};
  var width = $(config.chartId).width() - margin.left - margin.right;
  var height = $(config.chartId).height() - margin.top - margin.bottom;
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  function getDate(d) {return x(d.date)};
  function getDeaths(d) {return y(d.deaths.Total)};
  function getAffected(d) {return y(d.affected.Total)};
  function getZero(d) {return y(0)};

  function getCountyData(attr, county) {
    county = county || 'Total'
    return data.slice(-1)[0][attr][county]
  }

  function getLabelPos(counties, attr) {
    initVal = getCountyData(attr, counties[0]) / 2
    function callback(prev, county){return prev + getCountyData(attr, county)}
    return counties.slice(1).reduce(callback, initVal)
  }

  x.domain(d3.extent(data, function(d) {return d.date}));
  y.domain([0, d3.max(data, function(d) {return d.affected.Total})]);

  var xAxis = d3.svg.axis().scale(x).ticks(5).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left");

  var gridAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(-width , 0, 0)
    .tickFormat("");

  var deathLine = d3.svg.line().x(getDate).y(getDeaths);
  var caseLine = d3.svg.line().x(getDate).y(getAffected);
  var deathArea = d3.svg.area().x(getDate).y0(getZero).y1(getDeaths);
  var caseArea = d3.svg.area().x(getDate).y0(getDeaths).y1(getAffected);

  var stack = d3.layout.stack()
    .offset("zero")
    .values(function (d) {return d.values})
    .x(function (d) {return x(d.label)})
    .y(function (d) {return d.value});

  var area = d3.svg.area()
    .x(function (d) {return x(d.label)})
    .y0(function (d) {return y(d.y0)})
    .y1(function (d) {return y(d.y0 + d.y)});

  stack(seriesDeathArr);
  stack(seriesCaseArr);

  var svg = d3.select(config.chartId).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "grid")
    .call(gridAxis);

  svg.append("g")
    .attr("class", "xaxis axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "yaxis axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end");

  function fade(path, label, vals) {
    d3.selectAll("." + path).transition().duration(500).attr("opacity", vals[0]);
    d3.selectAll(".linelabels").transition().duration(500).attr("opacity", vals[1]);
    d3.selectAll("." + label).transition().duration(500).attr("opacity", vals[2]);

    if (vals.length > 3) {
      d3.selectAll(".deathline").transition().duration(500).attr("opacity", vals[3]);
    }
  }

  var categories = [
    {
      "attr": "affected",
      "title": "Deaths and Injuries",
      "cls": "line",
      "selector": ".seriescases",
      "path": "casePath",
      "label": "areacaselabels",
      "mouseover": [0.5, 0, 1, 0],
      "mouseout": [0, 1, 0, 1],
      "d": caseLine,
      "stroke": config.caseColors[3],
      "data": seriesCaseArr,
      "color": caseColor,
      "area": caseArea
    }, {
      "attr": "deaths",
      "title": "Deaths",
      "cls": "line deathline",
      "selector": ".seriesdeath",
      "path": "deathPath",
      "label": "areadeathlabels",
      "mouseover": [0.5, 0, 1],
      "mouseout": [0, 1, 0],
      "d": deathLine,
      "stroke": config.deathColors[3],
      "data": seriesDeathArr,
      "color": deathColor,
      "area": deathArea
    }
  ];

  categories.forEach(function(cat){
    var prevCounties = [];

    svg.append("g")
      .append("text")
      .attr("x", width - 50 - cat.title.length * 7)
      .attr("y", y(getCountyData(cat.attr)) - 10)
      .attr("dy", ".2em")
      .style("text-anchor", "start")
      .text(cat.title + " (" + getCountyData(cat.attr) + ")")
      .attr("class", "linelabels");

    config.counties.forEach(function(county){
      prevCounties.unshift(county);

      svg.append("g")
        .append("text")
        .attr("x",width + 10)
        .attr("y", y(getLabelPos(prevCounties, cat.attr)))
        .attr("dy", ".2em")
        .style("text-anchor", "start")
        .text(county.toUpperCase() + " ("+ getCountyData(cat.attr, county) + ")")
        .attr("class", cat.label)
        .attr("opacity", 0);
    });

    svg.append("path")
      .datum(data)
      .attr("class", cat.cls)
      .attr("d", cat.d)
      .attr("fill", "none")
      .attr("stroke", cat.stroke)
      .attr("stroke-width", "2px");

    var selection = svg.selectAll(cat.selector)
      .data(cat.data)
      .enter().append("g")
      .attr("class", "series");

    selection.append("path")
      .attr("class", cat.path)
      .attr("d", function (d) {return area(d.values)})
      .style("fill", function (d) {return cat.color(d.name)})
      .style("stroke", function (d) {return cat.color(d.name)})
      .attr("opacity",0);

    svg.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", cat.area)
      .attr("opacity", 0)
      .on("mouseover", function(){fade(cat.path, cat.label, cat.mouseover)})
      .on("mouseout", function(){fade(cat.path, cat.label, cat.mouseout)});
  });
}

function categorize(d) {
  var match = config.counties.some(function(county){
    return d[config.whereFieldName] === county
  });

  return match ? d[config.whereFieldName] : 'other';
};

function normalizeData(data) {
  var results = [];
  var sorted = data.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date)
  });
  var grouped = _.groupBy(sorted, function(e){return e.date});
  var result = {'deaths': {'Total': 0}, 'affected': {'Total': 0}}

  config.counties.forEach(function(county){
    result.deaths[county] = 0
    result.affected[county] = 0
  });

  for (date in grouped) {
    result = {
      'date': new Date(date),
      'deaths': _.clone(result.deaths),
      'affected': _.clone(result.affected)
    };

    grouped[date].forEach(function(value){
      county = categorize(value)
      result.deaths[county] += value.dead
      result.deaths.Total += value.dead
      result.affected[county] += value.dead + value.injuries
      result.affected.Total += value.dead + value.injuries
    });

    results.push(result);
  };

  return results
};

function summarizeData(data) {
  var results = [];
  var grouped = _.groupBy(data, function(d){return d[config.whereFieldName]});

  for (county in grouped) {
    var affected = grouped[county].reduce(function(prev, value){
      return prev + value.dead + value.injuries
    }, 0);

    results.push({'county': county, 'affected': affected});
  };

  return results
};

function fixName(name) {
  var trimmed = name.trim().toLowerCase();
  return bad[trimmed] || trimmed;
};

module.exports = {
  initCharts: function initCharts() {
    var data = config.data.result.records;

    data.forEach(function(e){
      e.dead = parseInt(e.dead) || 0
      e.households = parseInt(e.households) || 0
      e.injuries = parseInt(e.injuries) || 0
      e.county = fixName(e.county)
    });

    var normalized = normalizeData(data);
    var summarized = summarizeData(data);

    generateLineChart(config, normalized);
    generateChoropleth(config, summarized);
  }
}
