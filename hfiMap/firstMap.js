async function drawChart() {

    // 1. Access data
    let dataset = await d3.csv("https://gist.githubusercontent.com/glosophy/3c245c2723c257b8c98982736a015363/raw/7477bbc3125ea2540b3c649a2e7a53f4ac7e87cb/changeHumanScore2019.csv")

    const lat = d => +d.latitude
    const long = d => +d.longitude
    const population = d => +d.population
    const changeLabel = d => +d.changeLabel
    const humanScore = d => +d.hf_score

    // 2. Create chart dimensions

    const width = d3.min([
    window.innerWidth * 1.75,
    window.innerHeight * 1.75,
    ])

    let dimensions = {
        width: width,
        height: width * 0.5,
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
    const wrapper = d3
        .select("#wrapper1")
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
        const rMin = 0.05
        const rMax = Math.sqrt(peopleMax / (peoplePerPixel * Math.PI))

        rScale.range([rMin, rMax])

        // const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        //     .domain([0, 1, 2])
        //     .range(['grey', 'blue', 'orange'])

  const drawScatter = (dataset) => {

        // draw the points
        const dots = bounds
            .selectAll("circle")
            .data(dataset)

        const newDots = dots.enter().append("circle")

        const allDots = newDots.merge(dots)
            .attr("cx", d => xScale(long(d)))
            .attr("cy", d => yScale(lat(d)))
            .attr("r", d => rScale(population(d)))
            .attr("fill", 'black')
            .style('opacity', 0.35)


        const oldDots = dots.exit()
            .remove()

    }

  drawScatter(dataset)

    // set up interactions
    bounds
      .selectAll('circle')
      .on('mouseenter', onMouseEnter)
      .on('mouseleave', onMouseLeave)

    const tooltip = d3.select('#tooltip1')
    function onMouseEnter(e, datum) {

      const formatPopulation = d3.format(',')
      tooltip.select('#population1')
          .text(formatPopulation(datum.population))

      const formatHumanScore = d3.format('.2f')
      tooltip.select('#humanScore1')
          .text(formatHumanScore(datum.hf_score))

      tooltip.select('#countries1')
          .text(datum.country)

      tooltip.select('#city1')
          .text(datum.asciiname)

      const x = xScale(long(datum))
        + dimensions.margin.left
      const y = yScale(lat(datum))
        + dimensions.margin.top


      tooltip.style('transform', `translate(`
        + `calc( -50% + ${x}px),`
        + `calc( -100% + ${y}px)`
        + `)`)

      tooltip.style('opacity', 1)

    }

    function onMouseLeave() {
      tooltip.style('opacity', 0)
    }


}

drawChart()
