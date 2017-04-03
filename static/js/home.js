
// AJAX
// getData initializes data
var daylight = [];
var getData = function() {
    $.ajax({
	url: '/dataret',
	type: 'GET',
	success: function( d ) {
	    d = JSON.parse(d);
	    daylight = d['data'];
	    createGraph(daylight)
	}
    });
    
};

// Onload
// inits data on window load
window.onload = function(){
    getData();
    console.log("loaded");
};

var createGraph = function(daylight){
    console.log(daylight);
    
    var createGradient = function(svg, id, stops){
	var svgNS = svg.namespaceURI;
	var grad  = document.createElementNS(svgNS,'linearGradient');
	grad.setAttribute("id",id);
	for (var i = 0; i< stops.length; i++) {
            var attrs = stops[i];
            var stop = document.createElementNS(svgNS,'stop');
            for (var attr in attrs) {
		if (attrs.hasOwnProperty(attr)) stop.setAttribute(attr,attrs[attr]);
            }
            grad.appendChild(stop);
	}

	var defs = svg.querySelector('defs') ||
            svg.insertBefore( document.createElementNS(svgNS,'defs'), svg.firstChild);
	return defs.appendChild(grad);
    };

    var night = "#001848";
    var orange = "orange";
    var day = "#87CEEB";

    // Dynamically set this
    createGradient(document.getElementById("graphSVG"),"background",[
	{offset:'0%', 'stop-color':night},
	{offset:'30%', 'stop-color':orange},
	{offset:'45%', 'stop-color':day},
	{offset:'80%', 'stop-color':orange},
	{offset:'100%','stop-color':night}
    ]);

    d3.select('svg rect').attr('fill','url(#background)');

    // console.log(daylight);

    // var daylight = d3.range(365).map(function (i) {
    //     return Math.random();
    // });

    var height = 700;
    var width = 1000;
    var barPadding = 0;
    var barWidth = (width / daylight.length*1.5) - barPadding;

    var yScale = d3.scale.linear()
	.domain([0, d3.max(daylight)])
	.range([0, height/1.75]);

    var xScale = d3.scale.ordinal()
	.domain(daylight)
	.rangeBands([0, width], 0, 0);

    var svg = d3.select("#graphSVG")
	.style('width', width + 'px')
	.style('height', height + 'px');

    svg.selectAll('rect')
	.data(daylight)
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

};
