# d3-map-pan-zoom
Demo illustrating how to implement pan/zoom in a D3 map, using version 6 of the d3.js library.

This demo app makes use of the following external resources loaded from a CDN:
* jQuery version 1.12.4
* D3 version 6.3.1

## Internals
Execution is 'kicked-off' by this piece of code in the index.html file:
```
	$(document).ready(function() {
		initialize();	
	});	
```
Here, we use the jQuery library to notify us when the document's __ready__ event has fired.
This event is fired by the browser when  the HTML document has been completely parsed; 
it doesn't wait for other things like images, subframes, and async scripts to finish loading.
See this [MDN page](https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event) for full details.
When this event fires, the code snippet listed above calls our __initialize__ function.

The __initialize__ function begins with some code that exposes or hides the #blurb \<div\> \(which contains
some documentaiton the app and the data sources it uses\) based on a click to the #showhide button.
This is followed by a call to the main 'workhorse' function, __generateViz__.

The generateViz function is organized as follows:
1. Code to define the SVG drawing area, the projection to use for our data, 
   and an SVG geoPath generator function
2. The defintion of a function, __zooming__ to apply a new scale factor and 'translation'
   to the SVG map when a zoom (these include 'pans') is performed
3. A statement that defines the bounds of the zoom, and which binds 'zoom' events
   to the function defined in \(2\)
4. An SVG 'group' (a.k.a. 'container') object (a \<g\>in which all 'zoomable' objects will live;
   this is assigned to the JavaScript variable __map__
5. An invisible SVG \<rect\> is appended to __map__, which is used to catch pan/zoom events
6. The GeoJSON data is loaded using d3's __d3.json__ method; when the data is loaded,
   the code appends an SVG \<path\> to the SVG __map__ container for each feature in the
   GeoJSON, i.e., each town

## Running the app
* Clone the repository into a directory, call it 'x'
* 'cd x'
* python -m http.server 8888 --bind localhost
* In a web browser:
  * http://localhost:8888

## Colophon
Author: [Ben Krepp](mailto:bkrepp@ctps.org)  
Address: Central Transportation Planning Staff, Boston Region Metropolitan Planning Agency  
10 Park Plaza  
Suite 2150  
Boston, MA 02116  
United States