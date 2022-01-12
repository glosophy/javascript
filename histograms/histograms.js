async function drawBars() {

  // 1. Access data
  const dataset = await d3.json("./mainCat.json")

  // 2. Create chart dimensions
  const width = 500
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }

  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Draw canvas
  const wrapper = d3.select('#wrapper')
    .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)

  const bounds = wrapper.append('g')
      .style('transform', `translate(${dimensions.margin.left}px,
                                      ${dimensions.margin.top}px)`)

  // init static elements
  bounds.append('g')
      .attr('class', 'bins')
  bounds.append('line')
      .attr('class', 'mean')
  bounds.append('g')
      .attr('class', 'x-axis')
      .style('transform', `translateY(${dimensions.boundedHeight}px)`)
    .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', dimensions.boundedWidth / 2)
      .attr('y', dimensions.margin.bottom -10)

  const drawHistogram = metric => {
    const metricAccessor = d => d[metric]
    const yAccessor = d => d.length

    // 4. Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(dataset, metricAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const binsGenerator = d3.bin()
      .domain(xScale.domain())
      .value(metricAccessor)
      .thresholds(12)

    const bins = binsGenerator(dataset)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice()

    // 5. Draw data
    const barPadding = 1

    const exitTransition = d3.transition().duration(400)
    const updateTransition = exitTransition.transition().duration(400)

    let binGroups = bounds.select('.bins')
      .selectAll('.bin')
      .data(bins)

    const oldBinGroups = binGroups.exit()
    oldBinGroups.selectAll('rect')
          .style('fill', 'red')
        .transition(exitTransition)
          .attr('y', dimensions.boundedHeight)
          .attr('height', 0)

    oldBinGroups.selectAll('text')
        .transition(exitTransition)
          .attr('y', dimensions.boundedHeight)

          


  }


  // 6. Draw peripherals


}
drawBars()
