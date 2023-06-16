function scatterplot(x, y, s){
  d3.csv('classes_metrics.csv').then(data => {
    const axis_x = data.map(d => parseFloat(d[x]));
    const axis_y = data.map(d => parseFloat(d[y]));
    const godClassData = data.map(d => parseInt(d[s]));

    const chartData = axis_y.map((_, index) => ({
      x: axis_x[index],
      y: axis_y[index],
      godClass: godClassData[index]
    }));

    const width = 800;
    const height = 400;
    const padding = 40;

    const svg = d3.select('#scatterChart')
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom()
        .scaleExtent([1, 10])
        .on('zoom', zoomed));

    const chartArea = svg.append('g');

    const xScale = d3.scaleLinear()
      .domain([d3.min(axis_x), d3.max(axis_x)])
      .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(axis_y), d3.max(axis_y)])
      .range([height - padding, padding]);

    chartArea.selectAll('circle')
      .data(chartData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 4)
      .attr('fill', 'none')
      .attr('stroke', d => (d.godClass === 0) ? '#1985FF' : '#F59D00');

    chartArea.append('g')
      .attr('transform', `translate(0, ${height - padding})`)
      .call(d3.axisBottom(xScale));

    chartArea.append('g')
      .attr('transform', `translate(${padding}, 0)`)
      .call(d3.axisLeft(yScale));

    function zoomed(event) {
      const { transform } = event;
      chartArea.attr('transform', transform);
      chartArea.attr('stroke-width', 1 / transform.k);
    }
  });
}
