async function drawChart() {

    // 1. Access data
    let dataset = await d3.csv("https://gist.githubusercontent.com/glosophy/66d48c7bca4a94a7a1981379edd6d65b/raw/a698fa51fcf79262f01a14efc06dcec1545cb98a/cities2019.csv")

    const lat = d => +d.latitude
    const long = d => +d.longitude
    const population = d => +d.population
    const quartile = d => +d.hf_quartile

    // 2. Create chart dimensions

    const width = d3.min([
    window.innerWidth * .9,
    window.innerHeight * .9,
    ])

    let dimensions = {
        width: width * 2,
        height: width,
        margin: {
            top: 10,
            right: 10,
            bottom: 50,
            left: 50,
        },
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    // create chart area
    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
        .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

        // create scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(dataset, long))
            .range([0, dimensions.boundedWidth])

        const yScale = d3.scaleLinear()
            .domain(d3.extent(dataset, lat))
            .range([dimensions.boundedHeight, 0])

        // Compute the size of the biggest circle as a function of peoplePerPixel
        const rScale = d3.scaleSqrt()
          .domain([0, d3.max(dataset, d => d.population)])

        const peopleMax = rScale.domain()[1]
        const peoplePerPixel = 10000
        const rMin = 0.1
        const rMax = Math.sqrt(peopleMax / (peoplePerPixel * Math.PI))

        rScale.range([rMin, rMax])

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain([0, 1, 2, 3, 4])
            .range(['#f3e9cf', '#f0ad17', '#a60019', '#154084', '#222222'])

  const drawScatter = (dataset) => {

        // draw the points
        const dots = bounds.selectAll("circle")
            .data(dataset)

        const newDots = dots.enter().append("circle")

        const allDots = newDots.merge(dots)
            .attr("cx", d => xScale(long(d)))
            .attr("cy", d => yScale(lat(d)))
            .attr("r", d => rScale(population(d)))
            .attr("fill", d => colorScale(quartile(d)))
            .style('opacity', 0.35)
            .on("mouseenter", onMouseEnter)
            .on("mouseleave", onMouseLeave)

        const oldDots = dots.exit()
            .remove()

    }

  drawScatter(dataset)

  const delaunay = d3.Delaunay.from(
    dataset,
    d => xScale(lat(d)),
    d => yScale(long(d)),
  )
  const voronoi = delaunay.voronoi()
  voronoi.xmax = dimensions.boundedWidth
  voronoi.ymax = dimensions.boundedHeight

  bounds.selectAll(".voronoi")
    .data(dataset)
    .enter().append("path")
      .attr("class", "voronoi")
      .attr("d", (d,i) => voronoi.renderCell(i))
      .attr('stroke', 'white')
      // .attr("stroke", d => colorScale(quartile(d)))
      .attr('stroke-width', 0.75)
      .style('fill', d => colorScale(quartile(d)))
      .on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)

  const tooltip = d3.select("#tooltip")

  function onMouseEnter(e, datum) {

    const dayDot = bounds.append("circle")
        .attr("class", "tooltipDot")
        .attr("cx", d => xScale(lat(datum)))
        .attr("cy", d => yScale(long(datum)))
        .attr("r", d => rScale(population(datum)))
        .style('stroke', 'black')
        .style('stroke-width', 0.3)
        .style("pointer-events", "none")


    const formatPopulation = d3.format(",")
    tooltip.select("#population")
        .text(formatPopulation(datum.population))

    tooltip.select("#countries")
        .text(datum.country)

    tooltip.select("#city")
        .text(datum.asciiname)

    const x = xScale(lat(datum))
      + dimensions.margin.left
    const y = yScale(long(datum))
      + dimensions.margin.top

    tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
      + `calc( -100% + ${y}px)`
      + `)`)

    tooltip.style("opacity", 1)

    }

  function onMouseLeave() {
    d3.selectAll(".tooltipDot")
      .remove()

    tooltip.style("opacity", 0)
  }
}

drawChart()
