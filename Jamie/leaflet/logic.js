var map = L.map("map", {
  center: [50, -115],
  zoom: 3
});

L.tileLayer("https://api.mapbox.com/styles/v1/jamiejin91/cjb4aryzk6z6y2so0gnawkf6s/tiles/256/{z}/{x}/{y}?access_token=" + 
  "pk.eyJ1IjoiamFtaWVqaW45MSIsImEiOiJjamFrYTFnbjEyZ2dvMzNxdTdkMHJ4cG1wIn0.uvp0QKa2TpxLA_-6JW1lIA").addTo(map);

var link = "https://raw.githubusercontent.com/racquesta/powerball_viz/master/Jamie/us_geojson_creator/us_territories.geojson";

function chooseColor(info) {
  if (info >= 4000000) {
    return "red"
  }
  else if (info >= 3000000) {
    return "orange"
  }
  else if (info >= 2000000) {
    return "orange"
  }
  else if (info >= 1000000) {
    return "yellow"
  }
  else {
    return "green"
  }
};

d3.json(link, function(data) {
  L.geoJson(data, {
    style: function(feature) {
      return {
        color: "white",
        fillColor: chooseColor(feature.properties.info_2),
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          map.fitBounds(event.target.getBounds());
        }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1>" + feature.properties.state_name + 
      "</h1> <hr> <h2>" + "# of Winners: " + feature.properties.info_1 + "</h1> <hr> <h2>" + 
      "Population: " + feature.properties.info_2 + "</h2>" + "</h1> <hr> <h2>" + 
      "Per Capita Income: " + feature.properties.info_2 + "</h2>" + "</h1> <hr> <h2>" + 
      "Poverty Rate: " + feature.properties.info_2 + "</h2>");
    }
  }).addTo(map);
});
