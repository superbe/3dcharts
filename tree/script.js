
// Свернуть узел и все его дочерние элементы
function collapse(d) {
	if (d.children) {
		d._children = d.children
		d._children.forEach(collapse)
		d.children = null
	}
}

// Обновить дерево
function update(source) {
	var treeData = treemap(root);
	var nodes = treeData.descendants(),
		links = treeData.descendants().slice(1);

	var node = svg.selectAll('g.node')
		.data(nodes, function (d) { return d.id || (d.id = ++i); });

	var nodeEnter = node.enter().append('g')
		.attr('class', 'node')
		.attr("transform", function (d) {
			return "translate(" + source.y0 + "," + source.x0 + ")";
		})
		.on('click', click);

	nodeEnter.append('circle')
		.attr('class', 'node')
		.attr('r', 1e-6)
		.style("fill", function (d) {
			return d._children ? "lightsteelblue" : "#fff";
		});

	nodeEnter.append('text')
		.attr("dy", ".35em")
		.attr("x", function (d) {
			return d.children || d._children ? -13 : 13;
		})
		.attr("text-anchor", function (d) {
			return d.children || d._children ? "end" : "start";
		})
		.text(function (d) { return d.data.name; });

	var nodeUpdate = nodeEnter.merge(node);

	nodeUpdate.transition()
		.duration(duration)
		.attr("transform", function (d) {
			return "translate(" + d.y + "," + d.x + ")";
		});

	nodeUpdate.select('circle.node')
		.attr('r', 10)
		.style("fill", function (d) {
			return d._children ? "lightsteelblue" : "#fff";
		})
		.attr('cursor', 'pointer');


	var nodeExit = node.exit().transition()
		.duration(duration)
		.attr("transform", function (d) {
			return "translate(" + source.y + "," + source.x + ")";
		})
		.remove();

	nodeExit.select('circle')
		.attr('r', 1e-6);

	nodeExit.select('text')
		.style('fill-opacity', 1e-6);

	var link = svg.selectAll('path.link')
		.data(links, function (d) { return d.id; });

	var linkEnter = link.enter().insert('path', "g")
		.attr("class", "link")
		.attr('d', function (d) {
			var o = { x: source.x0, y: source.y0 }
			return diagonal(o, o)
		});

	var linkUpdate = linkEnter.merge(link);

	linkUpdate.transition()
		.duration(duration)
		.attr('d', function (d) { return diagonal(d, d.parent) });

	var linkExit = link.exit().transition()
		.duration(duration)
		.attr('d', function (d) {
			var o = { x: source.x, y: source.y }
			return diagonal(o, o)
		})
		.remove();

	nodes.forEach(function (d) {
		d.x0 = d.x;
		d.y0 = d.y;
	});

	function diagonal(s, d) {

		path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

		return path
	}

	function click(d) {
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			d.children = d._children;
			d._children = null;
		}
		update(d);
	}
}

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

var i = 0, duration = 750, root;

// Объявляем древовидную структуру и назначаем размер.
var treemap = d3.tree().size([height, width]);

// Отстроили дерево.
function buildTree(jdata) {
	root = d3.hierarchy(jdata, function (d) { return d.children; });
	root.x0 = height / 2;
	root.y0 = 0;
	root.children.forEach(collapse);
	update(root);
}

fetch('data.json').then(function (response) {
	if (response.ok) {
		response.json().then(function (json) {
			buildTree(json);
		});
	} else {
		console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
	}
});
