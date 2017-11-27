import * as d3 from 'd3';
import './index.scss';

const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json",
	margin = { top: 50, left: 50, right: 50, bottom: 50},
	height = 400 - margin.top - margin.bottom,
	width = 800 - margin.left - margin.right;

const div = d3.select("main").append("div")
		.attr("class","tooltip")
		.style("opacity", 0);

const svg = d3.select("main")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform","translate("+margin.left+","+margin.top+")");

d3.queue()
	.defer(d3.json, "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json")
	.defer(d3.json, url)
	.await(ready);

var projection = d3.geoMercator()
	.translate([ width / 2, height / 2 ])
	.scale(100);

var path = d3.geoPath()
	.projection(projection);

function ready(error,data,impacts) {
	var countries = topojson.feature(data, data.objects.countries1).features;
	console.log(impacts);
	svg.selectAll(".country")
		.data(countries)
		.enter().append("path")
		.attr("class", "country")
		.attr("d", path);

	svg.selectAll(".impact")
		.data(impacts.features)
		.enter().append("circle")
		.attr("r", (d)=>Math.log(Number(d.properties.mass)))
		.attr("cx", function(d) {
			var coords = projection([d.properties.reclong,d.properties.reclat]);
			return coords[0];
		})
		.attr("cy", function(d) {
			var coords = projection([d.properties.reclong,d.properties.reclat]);
			return coords[1];
		})
		.attr("class","impact")
		.on('mouseover', function(d) {
			let info = d.properties.name + "<br/>" + "Mass: " + d.properties.mass;
			d3.select(this).classed("selected", true)
			div.transition()
				.duration(200)
				.style("opacity",.9);
			div.html(info)
				.style("left", (d3.event.pageX)+"px")
				.style("top", (d3.event.pageY-28)+"px");
		})
		.on('mouseout', function(d) {
			d3.select(this).classed("selected", false)
			div.transition()
				.duration(500)
				.style("opacity", 0);
		});
}