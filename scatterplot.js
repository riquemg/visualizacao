// Carrega os dados do arquivo CSV usando D3.js
function plot(x, y, s){
  d3.csv('classes_metrics.csv').then(data => {
    const axis_x = data.map(d => parseFloat(d[x]));
    const axis_y = data.map(d => parseFloat(d[y]));
    const godClassData = data.map(d => parseInt(d[s]));

    // Prepara os dados para o gráfico
    const chartData = axis_x.map((_, index) => ({
      x: axis_y[index],
      y: axis_x[index],
      godClass: godClassData[index]
    }));

    // Configuração do tamanho do gráfico
    const width = 800;
    const height = 400;
    const padding = 40;

    // Cria o elemento SVG
    const svg = d3.select('#scatterChart')
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom()
        .scaleExtent([1, 10])
        .on('zoom', zoomed));

    const chartArea = svg.append('g');

    // Cria as escalas para os eixos x e y
    const xScale = d3.scaleLinear()
      .domain([d3.min(axis_y), d3.max(axis_y)])
      .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(axis_x), d3.max(axis_x)])
      .range([height - padding, padding]);

    // Cria os pontos do gráfico
    chartArea.selectAll('circle')
      .data(chartData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 4)
      .attr('fill', 'none')
      .attr('stroke', d => (d.godClass === 0) ? '#1985FF' : '#F59D00');

    // Cria os eixos x e y
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