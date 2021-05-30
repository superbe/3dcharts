console.clear();
const width = 800;
const height = 600;
const padding = 50;
const innerWidth = width - padding * 2;
const innerHeight = height - padding * 2;

const svg = d3.select('svg').attr('width', width).attr('height', height);
const rootLayer = svg.append('g').attr('transform', `translate(${padding}, ${padding})`);
const axisLayer = rootLayer.append('g');
const xAxisLayer = axisLayer.append('g');
const yAxisLayer = axisLayer.append('g');
const tasksLayer = rootLayer.append('g');

let series = [];
let xExtent;
let yExtent;
let xScale;
let yScale;
let xAxis;
let yAxis;

const preProcess = () => {
  series = datas.map(data => ({
    name: data.name,
    start: new Date(data.start),
    end: new Date(data.end),
    fill: data.fill
  }))
}

const calcExtent = () => {
  xExtent = [d3.min(series, serie => serie.start), d3.max(series, serie => serie.end)];
}

const calcScale = () => {
  xScale = d3.scaleTime().range([0, innerWidth]).domain(xExtent);
  yScale = d3.scaleBand().range([0, innerHeight]).domain(series.map(serie => serie.name));
}

const paintAxis = () => {
  xAxis = d3.axisBottom().scale(xScale);
  yAxis = d3.axisLeft().scale(yScale);
  
  yAxisLayer.call(yAxis);
  xAxisLayer.call(xAxis);
}

const paintTasks = () => {
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

function buildGant(jdata) {
	root = d3.hierarchy(jdata, function (d) { return d.children; });
	root.x0 = height / 2;
	root.y0 = 0;
	root.children.forEach(collapse);
	update(root);
	
	
	preProcess();
	calcExtent();
	calcScale();
	paintAxis();
	paintTasks();	
}


fetch('data.json').then(function (response) {
	if (response.ok) {
		response.json().then(function (json) {
			//buildTree(json);
			
			series = datas.map(data => ({
				name: data.name,
				start: new Date(data.start),
				end: new Date(data.end),
				fill: data.fill
			}))
			
			console.log(series);
			
			
		});
	} else {
		console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
	}
});


