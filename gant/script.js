// Определяем размеры, поля и отступы.
const margin = { top: 20, right: 90, bottom: 30, left: 90 };
const padding = 50;

let width = 960 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;
let innerWidth = width - padding * 2;
let innerHeight = height - padding * 2;

// Добавляем объект svg в тело страницы.
// Добавляем элемент 'group' к 'svg' и перемещаем 
// элемент 'group' к верхнему левому краю.
var svg = d3.select("body").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate("
		+ margin.left + "," + margin.top + ")");

// Добавляем вспомогательные элементы в SVG
const rootLayer = svg.append('g').attr('transform', `translate(${padding}, ${padding})`);
const axisLayer = rootLayer.append('g');
const xAxisLayer = axisLayer.append('g');
const yAxisLayer = axisLayer.append('g');
const tasksLayer = rootLayer.append('g');

// Обновляем диаграмму.
function update(series, xScale, yScale) {
  tasksLayer.selectAll('rect')
            .data(series)
            .enter()
            .append('rect')
            .attr('x', serie => xScale(serie.start))
            .attr('width', serie => xScale(serie.end) - xScale(serie.start))
            .attr('height', yScale.bandwidth() * 0.5)
            .attr('fill', serie => serie.fill)
}

// Отрисовываем оси.
function paintAxis(xScale, yScale) {
  xAxisLayer.call(d3.axisBottom().scale(xScale));
  yAxisLayer.call(d3.axisLeft().scale(yScale));
}

// Высчитываем масштаб по оси x.
function calcXScale(series, xExtent, width) {
  return d3.scaleTime().range([0, innerWidth]).domain(xExtent);
}

// Высчитываем масштаб по оси y.
function calcYScale(series, height) {
  return d3.scaleBand().range([0, innerHeight]).domain(series.map(serie => serie.name));
}

// Высчитываем диапазон значений по оси x.
function calcExtent(series) {
  return [d3.min(series, serie => serie.start), d3.max(series, serie => serie.end)];
}

// Предобработка данных.
function preProcess(jdata) {
	return jdata.map(data => ({
				name: data.name,
				start: new Date(data.start),
				end: new Date(data.end),
				fill: data.fill
			}));
}

// Отрисовали диаграмму.
function buildGant(jdata) {
	let series = preProcess(jdata);
	let xExtent = calcExtent(series);
	let xScale = calcXScale(series, xExtent, innerWidth);
	let yScale = calcYScale(series, innerHeight);
	paintAxis(xScale, yScale);
	update(series, xScale, yScale);	
}

// Загрузили данные.
fetch('data.json').then(function (response) {
	if (response.ok) {
		response.json().then(function (json) {
			buildGant(json);
		});
	} else {
		console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
	}
});