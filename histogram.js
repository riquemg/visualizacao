 function histogram(metric, element){ 
    
  const margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#" + element)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            `translate(${margin.left},${margin.top})`);

  d3.csv("classes_metrics.csv").then( function(data) {

    const x = d3.scaleLinear()
        .domain([0, 100])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    const histogram = d3.histogram()
        .value(function(d) { return d[metric]; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(70)); // then the numbers of bins

    const bins = histogram(data);

    const y = d3.scaleLinear()
        .range([height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll("rect")
        .data(bins)
        .join("rect")
          .attr("x", 1)
      .attr("transform", function(d) { return `translate(${x(d.x0)} , ${y(d.length)})`})
          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1})
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", "#69b3a2")

  });
}
