$(function() {
	var margin = 10,
    outerDiameter = 960,
    innerDiameter = outerDiameter - margin - margin;



var x = d3.scale.linear()
    .range([0, innerDiameter]);

var y = d3.scale.linear()
    .range([0, innerDiameter]);

//sets color of outer circles
//default -     .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
var color = d3.scale.linear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

//Sets the size of the node
var pack = d3.layout.pack()
    .padding(2)
    .size([innerDiameter, innerDiameter])
    .value(function(d) { return d.nasf; });

//appends the chart to HTML tag
var svg = d3.select("div").append("svg")
    .attr("width", outerDiameter)
    .attr("height", outerDiameter)
  .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");


d3.json("data.json", function(error, root) {
  var focus = root,
      nodes = pack.nodes(root);


//appends circles and sets the properties
svg.append("g").selectAll("circle")
      .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";})
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("r", function(d) { return d.r; })	  
	  .style("fill", function(d) { 
	  		if(d.priority == 1){return d.children ? color(d.depth) : setColor(d); }
	  		else if (d.priority == 2){return d.children ? color(d.depth) : setColor(d); }
	  		else if (d.priority == 3) {return d.children ? color(d.depth) : setColor(d); }
	  		else if (d.priority == 4) {return d.children ? color(d.depth) : setColor(d); }
	  		else if (d.priority == 5) {return d.children ? color(d.depth) : setColor(d); }
	  		else {return d.children ? color(d.depth) : null; }}
	  )
      .on("click", function(d) { return zoom(focus == d ? root : d); });

//appends text to circles
  svg.append("g").selectAll("text")
      .data(nodes)
    .enter().append("text")
      .attr("class", "label")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("display", function(d) { return d.parent === root ? null : "none"; })
      .text(function(d) { 
      		if (d.nasf != null){ return d.name + " - NASF: " + d.nasf; }
      		else { return d.name; }}
      );

  d3.select(window)
      .on("click", function() { zoom(root); });

//sets color based on priority
function setColor(d){
	var priority = new Array();
	priority[1] = "rgb(177,3,24)";
	priority[2] = "rgb(223,66,66)";
	priority[3] = "rgb(225,228,147)";
	priority[4] = "rgb(135,198,132)";
	priority[5] = "rgb(182,217,179)";
	return priority[d.priority];
}
//sets transitions
  function zoom(d, i) {
    var focus0 = focus;
    focus = d;

    var k = innerDiameter / d.r / 2;
    x.domain([d.x - d.r, d.x + d.r]);
    y.domain([d.y - d.r, d.y + d.r]);
    d3.event.stopPropagation();

    var transition = d3.selectAll("text,circle").transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    transition.filter("circle")
        .attr("r", function(d) { return k * d.r; });
    

    transition.filter("text")
      .filter(function(d) { return d.parent === focus || d.parent === focus0; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }
});

d3.select(self.frameElement).style("height", outerDiameter + "px");


});