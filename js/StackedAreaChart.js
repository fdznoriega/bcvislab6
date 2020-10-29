
export default function StackedAreaChart(container) {

    // margin convention -- repeated code; put in another file?
    const margin = {top: 50, right: 50, bottom: 50, left: 50}
    const width = 650 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3.select(".chart").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // scaleTime, scaleLinear, scaleOrdinal
    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);
    const colorScale = d3.scaleOrdinal().range(d3.schemeTableau10)

    // axes containers
    const xAxis = d3.axisBottom();
    const yAxis = d3.axisLeft();

    const xAxisSVG = svg.append("g")
                        .attr("class", "axis x-axis")
                        .attr("transform", `translate(0, ${height})`)
    
    const yAxisSVG = svg.append("g")
                        .attr("class", "axis y-axis")

    // tooltip that shows data key in stacked chart
    const tooltip = svg.append("text")
                        .attr("class", "tooltip")
                        .attr("x", 10)
                        .attr("y", 10)

    function update(data) {

        let keys = data.columns.slice(1);

        var stack = d3.stack()
                        .keys(keys)
                        .order(d3.stackOrderNone)
                        .offset(d3.stackOffsetNone);
    
        var stackedData = stack(data);

        // update scales & axes
        xScale.domain(d3.extent(data.map(d => d.date)));   // x scale is time. assuming sorted...
        yScale.domain([0, d3.max(stackedData, 
            d => d3.max(d, dd => dd[1])
        )]); 
        
        colorScale.domain(keys);

        // create an area generator
        const area = d3.area()
	                    .x(d => xScale(d.data.date))
	                    .y0(d => yScale(d[0]))
                        .y1(d => yScale(d[1]));
                        
        // create areas based on stack
        const areas = svg.selectAll(".area")
            .data(stackedData, d => d.key);
        
        areas.enter()
            .append("path")
            .attr("fill", d => colorScale(d.key))
            .merge(areas)
            .attr("d", area)
            .on("mouseover", (event, d, i) => tooltip.text(d.key))
            .on("mouseout", (event, d, i) => tooltip.text(""))

        areas.exit().remove();
        // update axes

        xAxis.scale(xScale);
        yAxis.scale(yScale);

        // ~ summon ~ axes
        xAxisSVG.call(xAxis);
        yAxisSVG.call(yAxis);

    }

    return {
        update
    }
}