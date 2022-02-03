async function drawChart() {

    // 1. Access data
    let dataset = await d3.csv("https://gist.githubusercontent.com/glosophy/66d48c7bca4a94a7a1981379edd6d65b/raw/a698fa51fcf79262f01a14efc06dcec1545cb98a/cities2019.csv")

    const lat = d => +d.latitude
    const long = d => +d.longitude
    const population = d => +d.population
    const quartile = d => +d.hf_quartile

    // 2. Create chart dimensions

    const width = d3.min([
    window.Width * 2,
    window.innerHeight * 2,
    ])


    let dimensions = {
        width: width,
        height: width * 0.5,
        margin: {
            top: 0,
            right: 50,
            bottom: 0,
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


    function drawScatter(dataset) {
        // create scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(dataset, long))
            .range([0, dimensions.boundedWidth])

        const yScale = d3.scaleLinear()
            .domain(d3.extent(dataset, lat))
            .range([dimensions.boundedHeight, 0])


        // Compute the size of the biggest circle as a function of peoplePerPixel.
        const rScale = d3.scaleSqrt()
          .domain([0, d3.max(dataset, d => d.population)])

        const peopleMax = rScale.domain()[1]
        const peoplePerPixel = 10000
        const rMin = 0.1
        const rMax = Math.sqrt(peopleMax / (peoplePerPixel * Math.PI))

        rScale.range([rMin, rMax])


        console.log(rMax)
        console.log(rMin)
        console.log(peopleMax)

        // rScale
        //     .domain([0, d3.max(dataset, d => d.population)])
        //     .range([rMin, rMax])


        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain([0, 1, 2, 3, 4])
            .range(['red', 'blue', 'orange', 'green', 'purple'])


        // draw the points
        const dots = bounds.selectAll("circle")
            .data(dataset)
            .enter().append("circle")
            .attr("cx", d => xScale(long(d)))
            .attr("cy", d => yScale(lat(d)))
            .attr("r", d => rScale(population(d)))
            .attr("fill", d => colorScale(quartile(d)))
            .exit().remove()

    }

    drawScatter(dataset)
}

drawChart()
