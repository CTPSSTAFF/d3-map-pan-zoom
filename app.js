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
	d3.json("JSON/TOWNS_POLYM.topo.json",
		function(error, data) { 
			CTPS.demoApp.generateViz(data); 
		});
} // CTPS.demoApp.init()

CTPS.demoApp.generateViz = function(topoJsonData) {	

	var townsFeatureCollection = topojson.feature(topoJsonData, topoJsonData.objects.collection);
	
	var width = 960,
		height = 500;
		
	// Define Zoom Function Event Listener
	function zoomFunction() {
	  d3.selectAll("path")
		.attr("transform",
			"translate(" + d3.event.translate
			+ ") scale (" + d3.event.scale + ")");
	}

	// Define Zoom Behavior
	var zoom = d3.behavior.zoom()
		.scaleExtent([0.2, 10]) 
		.on("zoom", zoomFunction);

	// SVG Viewport
	var svgContainer = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)
		.style("border", "2px solid steelblue")
		.call(zoom);

	var projection = d3.geo.conicConformal()
		.parallels([41 + 43 / 60, 42 + 41 / 60])
	    .rotate([71 + 30 / 60, -41 ])
		.scale([12500]) // N.B. The scale and translation vector were determined empirically.
		.translate([500,560]);
		
	var geoPath = d3.geo.path().projection(projection);
			
	// Create Massachusetts towns map - all towns symbolized the same way.
	var maSVG = svgContainer.selectAll("path")
		.data(townsFeatureCollection.features)
		.enter()
		.append("path")
		.attr("id", function(d, i) { return d.properties.TOWN_ID; })
		.attr("d", function(d, i) { return geoPath(d); })	
		.style("fill", "#edab1e")
		.append("title")   
			.text(function(d, i) { return d.properties.TOWN; });
	
} // CTPS.demoApp.generateViz()