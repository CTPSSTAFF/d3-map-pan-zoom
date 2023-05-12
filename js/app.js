function initialize() {
	$('#showhide').click(function(e) {
		if (this.value === 'Show description') {
			$('#blurb').show();
			this.value = 'Hide description';
		} else {
			$('#blurb').hide();
			this.value = 'Show description';		
		}
	}); 
	generateViz();
} // initialize()

function generateViz() {
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

	// Define what to do when panning or zooming - event listener.
	// As of D3V6, event handlers are passed the _event_ and _datum_ as 
	// parameters, and _this_ is being the target node.
	var zooming = function(e, d) {
		// Log e.transform, so you can see all the goodies inside
		// console.log(e.transform);
		
		// New offset array
		var offset = [e.transform.x, e.transform.y];
		// Calculate new scale
		var newScale = e.transform.k * 2000;
		// Update projection with new offset and scale
		projection.translate(offset)
				  .scale(newScale);
		// Update all paths
		svg.selectAll("path")
			.attr("d", geoPath);
	}
	
	// Then define the zoom behavior
	// Constrain zoom range to be from 1/6x to 10x (N.B. application of scale factor)
	var zoom = d3.zoom()
				 .scaleExtent([1.0, 60.0])
				 .on("zoom", zooming);
				 
	// The center of the state (approximate)
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
	d3.json("../json/TOWNS_POLYM.geojson")
		.then(function(json) {
			var townsFeatureCollection = json.features;

			//Bind data and create one path per GeoJSON feature
			// Create Massachusetts towns map - all towns symbolized the same way.
			map.selectAll("path")
			   .data(json.features)
			   .enter()
			   .append("path")
			   .attr("d", geoPath)
			   .attr("id", function(d, i) { return d.properties.town_id})
			   .style("fill", function(d, i) {
						var fourcolors = ['#7fc97f','#beaed4','#fdc086','#ffff99'];
						var retval = fourcolors[d.properties.fourcolor-1];
						return retval;
					})
			   .append("title")   
			   .text(function(d, i) { return d.properties.town; });
	});
} // generateViz()