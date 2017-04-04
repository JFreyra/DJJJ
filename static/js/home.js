
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

var night = "#001848";
var orange = "orange";
var day = "#87CEEB";

// Onload
// inits data on window load
window.onload = function(){
    getData();
    console.log("loaded");
};

function GradientReader(colorStops) {

    var canvas = document.createElement('canvas'),     // create canvas element
        ctx = canvas.getContext('2d'),                 // get context
        gr = ctx.createLinearGradient(0, 0, 101, 0),   // create a gradient
        i = 0, cs;

    canvas.width = 101;                                // 101 pixels incl.
    canvas.height = 1;                                 // as the gradient

    for(; cs = colorStops[i++];)                       // add color stops
        gr.addColorStop(cs.stop, cs.color);

    ctx.fillStyle = gr;                                // set as fill style
    ctx.fillRect(0, 0, 101, 1);                        // draw a single line

    // method to get color of gradient at % position [0, 100]
    this.getColor = function(pst) {
        return ctx.getImageData(pst|0, 0, 1, 1).data;
    };
}

var gr = new GradientReader([
    {stop:0.2, color:night},
    {stop:0.35, color:orange},
    {stop:0.45, color:day},
    {stop:0.8, color:orange},
    {stop:1.0,color:night}
]);

var i = 0;
var setBackground = function() {
    setTimeout(function() {
        var color = gr.getColor(Math.floor(i*100/364));
        color = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
        background.attr("fill", color);
        i++;
        if (i < 365) {
            setBackground();
        }
    }, 50);
};

var background = d3.select("svg rect");

var createGraph = function(daylight){
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
            return 'rgb(0, ' + (182-Math.abs(i-182)) + ', 0)'
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
    setBackground();
};

//Generate y-axis label
var yAxisLabel = function(){
    var hours = [];
    for(i=1;i<25;i++){
        var h = {};
        if(i<10){
            h.cx = "2.5";
        }else{
            h.cx = "-1";
        };
        h.cy = (715.0/24)*(25-i)-((715.0/24)/2);
        h.t = i;
        h.color = parseInt(255-i*(255/24));
        hours.push(h);
    };
    console.log(hours);
    var text = d3.select("#axis").selectAll("g")
        .data(hours)
        .enter()
        .append("text");
    console.log(text);
    var addText = text
        .attr("x",function(d){return d.cx;})
        .attr("y",function(d){return d.cy;})
        .attr("fill",function(d){return "rgb("+d.color+","+d.color+","+d.color+")"})
        .text(function(d){return d.t;})
        .attr("font-size","15px");
};
yAxisLabel();
