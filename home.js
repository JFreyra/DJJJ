var data = d3.range(365).map(function () {
    return Math.random();
});

var height = 700;
var width = 1000;
var barPadding = 2;
var barWidth = (width / data.length) - barPadding;

var yScale = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, height/2]);

var xScale = d3.scale.ordinal()
    .domain(data)
    .rangeBands([0, width], 0.1, 0.3);

var svg = d3.select("#graphSVG")
    .style('width', width + 'px')
    .style('height', height + 'px');

svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr("x", function (d, i) {
	return xScale(d);
    })
    .attr("y", function (d, i) {
	return height;
    })
    .attr("width", function (d, i) {
	return xScale.rangeBand()
    })
    .attr("fill", function (d, i) {
	return 'rgb(256, ' + Math.round(i / 2) + ', ' + i + ')'
    })
    .attr("height", 0)
    .transition()
    .duration(200)
    .delay(function (d, i) {
	return i * 50;
    })
    .attr("y", function (d, i) {
	return height - yScale(d);
    })
    .attr("height", function (d, i) {
	return yScale(d);
    });
