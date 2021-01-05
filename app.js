var CTPS = {};
CTPS.demoApp = {};

CTPS.demoApp.init = function() {
	$('#showhide').click(function(e) {
		if (this.value === 'Show description') {
			$('#blurb').show();
			this.value = 'Hide description';
		} else {
			$('#blurb').hide();
			this.value = 'Show description';		
		}
	}); 
	CTPS.demoApp.generateViz();
} // CTPS.demoApp.init()

CTPS.demoApp.generateViz = function() {	
	var width = 960,
		height = 500;

	var projection = d3.geoConicConformal()
		.parallels([41 + 43 / 60, 42 + 41 / 60])
	    .rotate([71 + 30 / 60, -41 ]);
		
	var geoPath = d3.geoPath().projection(projection);

	// SVG Viewport
	var svg = d3.select("body")
				.append("svg")
				.attr("width", width)
				.attr("height", height)
				.style("border", "2px solid steelblue");

	//Define what to do when panning or zooming - event listener
	var zooming = function(d) {
		//Log d3.event.transform, so you can see all the goodies inside
		// console.log(d3.event.transform);
		
		//New offset array
		var offset = [d3.event.transform.x, d3.event.transform.y];
		//Calculate new scale
		var newScale = d3.event.transform.k * 2000;
		//Update projection with new offset and scale
		projection.translate(offset)
				  .scale(newScale);
		//Update all paths
		svg.selectAll("path")
			.attr("d", geoPath);
	}
	
	//Then define the zoom behavior
	var zoom = d3.zoom()
				 .on("zoom", zooming);
				 
	//The center of the state (approximate)
	var center = projection([-71.4, 42.4]);

	// Create a container in which all zoomable objects will live
	var map = svg.append("g")
			.attr("id", "map")
			.call(zoom)  //Bind the zoom behavior
			.call(zoom.transform, d3.zoomIdentity  	//Then apply the initial transform.
				.translate(500,530)					// N.B. The translation vector and 
				.scale(6));							//      scale factor were determined
													//      empirically.
													// N.B. The scale factor is multiplied
													//      by 2,000 in the zoom handler.

	//Create a new, invisible background rect to catch zoom events	
	map.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height)
		.attr("opacity", 0);
		
	//Load in GeoJSON data
	d3.json("JSON/towns_polym.geojson", function(json) {
		var townsFeatureCollection = json.features;

		//Bind data and create one path per GeoJSON feature
		// Create Massachusetts towns map - all towns symbolized the same way.
		map.selectAll("path")
		   .data(json.features)
		   .enter()
		   .append("path")
		   .attr("d", geoPath)
		   .attr("id", function(d, i) { return d.properties.town_id})
		   .style("fill", "#edab1e")
		   .append("title")   
		   .text(function(d, i) { return d.properties.town; })
	});
} // CTPS.demoApp.generateViz()