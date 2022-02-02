async function drawScatter() {

  // 1. Access data
  const dataset = await d3.csv("https://gist.githubusercontent.com/glosophy/e51fd3b97d3de9eb7d53e4e44a1e3e2a/raw/cae164661a6d272837448796df6287429d8f9fc0/cities2019.csv", type, render)

  const lat = d => d.latitude
  const long = d => d.longitude
  const population = d => d.population
  const quartile = d => d.hf_quartile

  // 2. Create chart dimensions

  const width = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9,
  ])
  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 0,
      right: -50,
      bottom: 0,
      left: -50,
    },
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom


  // // Define SVG + bounds
  // var outerWidth  = 2600;
  // var outerHeight = 1400;
  // var margin = { left: -50, top: 0, right: -50, bottom: 0 };
  //
  // var innerWidth  = outerWidth  - margin.left - margin.right;
  // var innerHeight = outerHeight - margin.top  - margin.bottom;

  // Define variables from csv
  var colorColumn = "hf_quartile"
  var xColumn = "longitude"
  var yColumn = "latitude"
  var rColumn = "population"
  var peoplePerPixel = 10000


  // Draw SVG + bounds
  var svg = d3.select("body").append("svg")
    .attr("width",  outerWidth)
    .attr("height", outerHeight);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xScale = d3.scale.linear().range([0, innerWidth]);
  var yScale = d3.scale.linear().range([innerHeight, 0]);
  var rScale = d3.scale.sqrt();
  var colorScale = d3.scale.category10()
      .domain([0, 1, 2, 3, 4])
      .range(['#000000', '#000000', '#000000', '#000000', '#000000']);

  function render(data){

    xScale.domain( d3.extent(data, d => d.longitude));
    yScale.domain( d3.extent(data, d => d.latitude));
    rScale.domain([0, d3.max(data, d => d.population)]);

    // Compute the size of the biggest circle as a function of peoplePerPixel.
    var peopleMax = rScale.domain()[1];
    // console.log(peopleMax)
    var rMin = 0.3;
    var rMax = Math.sqrt(peopleMax / (peoplePerPixel * Math.PI));

    // console.log(rMax)
    rScale.range([rMin, rMax]);

    var circles = g.selectAll("circle").data(data);
    circles.enter().append("circle");
    circles
      .attr("cx", function (d){ return xScale(d[xColumn]); })
      .attr("cy", function (d){ return yScale(d[yColumn]); })
      .attr("r",  function (d){ return rScale(d[rColumn]); })
      .attr("fill",  function (d){ return colorScale(d[colorColumn]); })
    circles.exit().remove();
  }

  function type(d){
    d.latitude   = +d.latitude;
    d.longitude  = +d.longitude;
    d.population = +d.population;
    d.hf_quartile = +d.hf_quartile;
    return d;
  }

}
drawScatter()
