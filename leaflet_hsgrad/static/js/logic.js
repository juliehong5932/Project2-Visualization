var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// Use this link to get the geojson data.
var link = "static/data/merged_state_data.geojson";
// var link = "static/data/statedata.geojson";


function getColor(d) {
  if (d>92){
   color_code='#800026'
  } else if (d>90) {
    color_code='#BD0026'
  } else if (d > 88) {
    color_code='#E31A1C'
  } else if (d > 86) {
    color_code='#FC4E2A'
  } else if (d > 84) {
    color_code='#FD8D3C'
  } else {
    color_code='#FED976'
  }
  return color_code;
      
};


// // Grabbing our GeoJSON data..
d3.json(link, function(statesData) {
  console.log(statesData);


  
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.percent_hs_grad),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
  };
  

 geoJson =  L.geoJson(statesData, {
   style:style, 
    onEachFeature: function(feature, layer){
      layer.bindPopup("<h3>"+ feature.properties.NAME+ "</h3>"+"<h4>"+"High School Graduation Percentage: " +"</h4>" +feature.properties.percent_hs_grad + "%")
      layer.on('mouseover', function(e){
        this.openPopup();
      layer.on('mouseout', function(e){
        this.closePopup();
      })
      });
    }
  }).addTo(myMap);

  var legend = L.control({
    position: 'bottomright'
  });

    legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
    var pct = [0, 84, 86, 88, 90, 92];
    var colors = ['#FED976', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

    
      for (var i = 0; i < pct.length; i++) {
        div.innerHTML +=
        "<li style='background:" + colors[i] + " '> </li>" +
        pct[i] + (pct[i + 1] ? '&ndash;' + pct[i + 1] + '<br>' : '+');
      };
      return div; 
  };

    legend.addTo(myMap);

  });


