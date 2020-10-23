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
  var link = "static2/data/merged_state_data.geojson";
  // var link = "static/data/statedata.geojson";
  
  
  function getColor(d) {
    if (d>40000){
     color_code='#154360'
    } else if (d>35000) {
      color_code='#1F618D'
    } else if (d > 30000) {
      color_code='#2980B9'
    } else if (d > 25000) {
      color_code='#7FB3D5'
    } else if (d > 20000) {
      color_code='#A9CCE3'
    } else {
      color_code='#C39BD3'
    }
    return color_code;
        
  };
  
  
  // // Grabbing our GeoJSON data..
  d3.json(link, function(statesData) {
    // console.log(statesData);
      
    function style(feature) {
      return {
          fillColor: getColor(feature.properties.per_capita_income),
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
        layer.bindPopup("<h3>"+ feature.properties.NAME+ "</h3>"+"<h4>"+"Per Capita Income: "+ "</h4>" + "$"+feature.properties.per_capita_income);
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
        var pct = [0, 20000, 25000, 30000, 35000, 40000];
        var colors = ['#C39BD3', '#A9CCE3', '#7FB3D5', '#2980B9', '#1F618D', '#154360'];
    
        
          for (var i = 0; i < pct.length; i++) {
            div.innerHTML +=
            "<li style='background:" + colors[i] + " '> </li>" +
            pct[i] + (pct[i + 1] ? '&ndash;' + pct[i + 1] + '<br>' : '+');
          };
          return div; 
      };
    
        legend.addTo(myMap);
    });
  
  
  