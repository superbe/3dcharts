
// Определяем отступы для диаграммы
var margin = { top: 20, right: 90, bottom: 30, left: 90 },
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

// Добавляем объект svg в тело страницы.
// Добавляем элемент 'group' к 'svg' и перемещаем 
// элемент 'group' к верхнему левому краю.
var svg = d3.select("body").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate("
		+ margin.left + "," + margin.top + ")");



// const width = 800;
// const height = 600;
// const padding = 50;
// const innerWidth = width - padding * 2;
// const innerHeight = height - padding * 2;

// const svg = d3.select('svg').attr('width', width).attr('height', height);
const rootLayer = svg.append('g').attr('transform', `translate(${padding}, ${padding})`);
const axisLayer = rootLayer.append('g');
const xAxisLayer = axisLayer.append('g');
const yAxisLayer = axisLayer.append('g');
const tasksLayer = rootLayer.append('g');

function update(series, xScale, yScale) {
  tasksLayer.selectAll('rect')
            .data(series)
            .enter()
            .append('rect')
            .attr('x', serie => xScale(serie.start))
            .attr('y', serie => yScale(serie.name) + yScale.bandwidth() * 0.25)
            .attr('width', serie => xScale(serie.end) - xScale(serie.start))
            .attr('height', yScale.bandwidth() * 0.5)
            .attr('fill', serie => serie.fill)
}

function paintAxis(xScale, yScale) {
  xAxisLayer.call(d3.axisBottom().scale(xScale));
  yAxisLayer.call(d3.axisLeft().scale(yScale));
}

function calcXScale(series, xExtent, width) {
  return d3.scaleTime().range([0, innerWidth]).domain(xExtent);
}

function calcYScale(series, height) {
  return d3.scaleBand().range([0, innerHeight]).domain(series.map(serie => serie.name));
}

function calcExtent(series) {
  return [d3.min(series, serie => serie.start), d3.max(series, serie => serie.end)];
}

function preProcess(jdata) {
	return jdata.map(data => ({
				name: data.name,
				start: new Date(data.start),
				end: new Date(data.end),
				fill: data.fill
			}));
}

function buildGant(jdata) {
	let series = preProcess(jdata);
	let xExtent = calcExtent(series);
	let xScale = calcXScale(series, xExtent, innerWidth);
	let yScale = calcYScale(series, innerHeight);
	paintAxis(xScale, yScale);
	update(series, xScale, yScale);	
}

fetch('data.json').then(function (response) {
	if (response.ok) {
		response.json().then(function (json) {
			buildGant(json);
		});
	} else {
		console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
	}
});


