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

const datas = [
  {
    "name": "Task1",
    "start": "2020/10/09 01:00:00",
    "end": "2020/10/09 02:00:00",
    "fill": "#b3e2cd"
  },
  {
    "name": "Task2",
    "start": "2020/10/09 02:00:00",
    "end": "2020/10/09 03:00:00",
    "fill": "#fdcdac"
  },
  {
    "name": "Task3",
    "start": "2020/10/09 02:00:00",
    "end": "2020/10/09 04:00:00",
    "fill": "#cbd5e8"
  },
  {
    "name": "Task4",
    "start": "2020/10/09 03:00:00",
    "end": "2020/10/09 04:00:00",
    "fill": "#f4cae4"
  },
  {
    "name": "Task5",
    "start": "2020/10/09 03:00:00",
    "end": "2020/10/09 05:00:00",
    "fill": "#e6f5c9"
  }
];

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


preProcess();
calcExtent();
calcScale();
paintAxis();
paintTasks();