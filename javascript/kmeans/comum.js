function upload(el) {
	var upload = document.getElementById(el);
	if (typeof window.FileReader === 'undefined') {
		alert('File API & FileReader não suportados');
	}

	upload.onchange = function (e) {
		e.preventDefault();
		var file = upload.files[0],
			reader = new FileReader();
		reader.onload = function (event) {
			return lerArquivo(event);
		};
		reader.readAsText(file);
		return false;
	};
}

window.dataSet = [];
window.MAXINTERACAO = 1000;
window.dataPlot = [];
window.centroidePlot = [];

function lerArquivo (evt) {
	var fileArr = evt.target.result.split('\n');
	var linha = fileArr[0].trim();
	for (var i = 0, length = fileArr.length; i < length; i++) {
		linha = fileArr[i].trim();
		if (linha.length > 0) {
			dataSet.push(linha.split(','));
		};
	};
}

function plot(pontosPlot,centroidePlot) {

	var vis = d3.select("#grafico"),
	WIDTH = 1000,
	HEIGHT = 500,
	MARGINS = {
		top: 20,
		right: 70,
		bottom: 20,
		left: 50
	},
	color = d3.scale.category10(),
	xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(pontosPlot, function (d) {
		return d.caracteristicas[0];
	  }),
	  d3.max(pontosPlot, function (d) {
		return d.caracteristicas[0];
	  })
	]),

	yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(pontosPlot, function (d) {
		return d.caracteristicas[1];
	  }),
	  d3.max(pontosPlot, function (d) {
		return d.caracteristicas[1];
	  })
	]),

	xAxis = d3.svg.axis()
		.scale(xRange)
		.tickSize(5)
		.tickSubdivide(true),

	yAxis = d3.svg.axis()
		.scale(yRange)
		.tickSize(5)
		.orient("left")
		.tickSubdivide(true);

	vis.append("svg:g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
		.call(xAxis);

	vis.append("svg:g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + (MARGINS.left) + ",0)")
		.call(yAxis);

	xRange.domain(d3.extent(pontosPlot, function(d) { return d.caracteristicas[0]; })).nice();
	yRange.domain(d3.extent(pontosPlot, function(d) { return d.caracteristicas[1]; })).nice();

	var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

	vis.selectAll(".dot")
		.data(pontosPlot)
		.enter().append("circle")
		.attr("class", "dot")
		.attr("r", 3.5)
		.attr("cx", function(d) { return xRange(d.caracteristicas[0]); })
		.attr("cy", function(d) { return yRange(d.caracteristicas[1]); })
		.style("fill", function(d,i) { return color(d.cluster); })
		.on("mouseover", function(d) {
        	div.transition()
            	.duration(200)
            	.style("opacity", .9);
        	div.html("["+d.caracteristicas[0] + ", "  + d.caracteristicas[1] + "]")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 18) + "px");
		})
		.on("mouseout", function(d) {
			div.transition()
				.duration(500)
				.style("opacity", 0);
		});

	vis.selectAll(".centroide")
		.data(centroidePlot)
		.enter().append("rect")
		.attr("class", "dot")
		.attr("x", function(d) {return xRange(d[0]); })
		.attr("y", function(d) {return yRange(d[1]); })
		.attr("width", 8)
		.attr("height",8)
		.style("fill", function(d,i){ return color(i)})
		.on("mouseover", function(d) {
        	div.transition()
            	.duration(200)
            	.style("opacity", .9);
        	div.html("["+d[0].toFixed(2) + ", "  + d[1].toFixed(2) + "]")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 18) + "px");
		})
		.on("mouseout", function(d) {
			div.transition()
				.duration(500)
				.style("opacity", 0);
		});



	var legend = vis.selectAll(".legend")
		.data(color.domain())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", WIDTH - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

	legend.append("text")
		.attr("x", WIDTH - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) {
			return "Cluster "+(d+1); });

}