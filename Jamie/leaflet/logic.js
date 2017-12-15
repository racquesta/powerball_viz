var map1 = L.map("map1", {
  center: [35, -100],
  zoom: 4
});

var map2 = L.map("map2", {
  center: [35, -100],
  zoom: 4
});

L.tileLayer("https://api.mapbox.com/styles/v1/jamiejin91/cjb4aryzk6z6y2so0gnawkf6s/tiles/256/{z}/{x}/{y}?access_token=" + 
"pk.eyJ1IjoiamFtaWVqaW45MSIsImEiOiJjamFrYTFnbjEyZ2dvMzNxdTdkMHJ4cG1wIn0.uvp0QKa2TpxLA_-6JW1lIA").addTo(map1);
L.tileLayer("https://api.mapbox.com/styles/v1/jamiejin91/cjb4aryzk6z6y2so0gnawkf6s/tiles/256/{z}/{x}/{y}?access_token=" + 
"pk.eyJ1IjoiamFtaWVqaW45MSIsImEiOiJjamFrYTFnbjEyZ2dvMzNxdTdkMHJ4cG1wIn0.uvp0QKa2TpxLA_-6JW1lIA").addTo(map2);

var link = "https://raw.githubusercontent.com/racquesta/powerball_viz/master/Jamie/us_geojson_creator/us_territories.geojson";

var acceptable = ["num_of_jp_win","jackpot_win_amount","total_win_amount","total_draw_sold","total_draw_sales"]

function chooseColor(info,max_info) {
  if (info == 0) {
    return 'grey'
  }
  else if (info >= 0.9 * max_info) {
    return '#800026'
  }
  else if (info >= 0.75 * max_info) {
    return '#BD0026'
  }
  else if (info >= 0.5 * max_info) {
    return '#E31A1C'
  }
  else if (info >= 0.4 * max_info) {
    return '#FC4E2A'
  }
    else if (info >= 0.3 * max_info) {
    return '#FD8D3C'
  }
    else if (info >= 0.2 * max_info) {
    return '#FEB24C'
  }
    else if (info >= 0.1 * max_info) {
    return '#FED976'
  }
  else {
    return '#FFEDA0'
  }
};

function numberWithCommas(number) {
  number = Math.ceil(number)

  if (isNaN(number)) {
      return '';
  }

  var asString = '' + Math.abs(number),
      numberOfUpToThreeCharSubstrings = Math.ceil(asString.length / 3),
      startingLength = asString.length % 3,
      substrings = [],
      isNegative = (number < 0),
      formattedNumber,
      i;

  if (startingLength > 0) {
      substrings.push(asString.substring(0, startingLength));
  }

  for (i=startingLength; i < asString.length; i += 3) {
      substrings.push(asString.substr(i, 3));
  }

  formattedNumber = substrings.join(',');
  if (isNegative) {
      formattedNumber = '-' + formattedNumber;
  }

    return formattedNumber;
};

function chooseString(string) {
  switch (string) {
    case "num_of_jp_win":
      return "# of Jackpot Winners: ";
    case "jackpot_win_amount":
      return "Total Jackpot Amount Won: $";
    case "total_win_amount":
      return "Total Amount Won: $";
    case "total_draw_sold":
      return "# of Tickets Sold:";
    case "total_draw_sales":
      return "Total Sales Amount: $";
    default:
      return;
  }
};

function findMax(data,param) {
  if (acceptable.includes(param)) {
    var param_data = [];
    for (i = 0; i < data.features.length; i++) {
      param_data.push(parseInt(data['features'][i]['properties'][param], 10))
    }
    var max_info = Math.max(...param_data)
    return(max_info)
  }
  else {
    return "order_66"
  }
};

function plot(map_x, param) {
  d3.json(link, function(data) {
    console.log()
    L.geoJson(data, {
      style: function(feature) {
        return {
          color: "white",
          fillColor: chooseColor(feature['properties'][param],findMax(data,param)),
          fillOpacity: 0.6,
          weight: 1.5
        };
      },
      onEachFeature: function(feature, layer) {
        layer.on({
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          },
          click: function(event) {
            map_x.fitBounds(event.target.getBounds());
          }
        });

        if (param == 'jackpot_win_amount') {
          var temp_number = numberWithCommas(feature['properties'][param] * 1000000)
          var addin_str = "</h1> <hr> <h2>" + chooseString(param) + temp_number + "</h2>"
        }
        else if (param == "order_66") {
          var addin_str = ""
        }
        else {
          var temp_number = numberWithCommas(feature['properties'][param])
          var addin_str = "</h1> <hr> <h2>" + chooseString(param) + temp_number + "</h2>"
        }
        
        layer.bindPopup("<h1>" + feature.properties.state_name + addin_str)
      }
    }).addTo(map_x);
  });
};

function init() {
  var $dropDown1 = document.getElementById("selData1")
  var $dropDown2 = document.getElementById("selData2")

  for (var i=0; i< acceptable.length; i++){
    var $option1 = document.createElement("option");
    $option1.innerHTML = chooseString(acceptable[i]).split(":")[0];
    $option1.setAttribute('id', acceptable[i]);
    $option1.setAttribute("value", acceptable[i]);
    var $option2 = document.createElement("option");
    $option2.innerHTML = chooseString(acceptable[i]).split(":")[0];
    $option2.setAttribute('id', acceptable[i]);
    $option2.setAttribute("value", acceptable[i]);
    $dropDown1.appendChild($option1);
    $dropDown2.appendChild($option2);
  }
 
  var legend1 = L.control({position: 'bottomleft'});

  legend1.onAdd = function (map) {

    var div1 = L.DomUtil.create('div', 'info legend1'),
        grades1 = [1, 10, 20, 30, 40, 50, 75, 90],
        labels1 = [];
    for (var i = 0; i < grades1.length; i++) {
        div1.innerHTML += '<i style="background:' + chooseColor(grades1[i], 100) + '"></i> ' +
        grades1[i] + (grades1[i + 1] ? '&ndash;' + grades1[i + 1] + '<br>' : '+');
    }

    return div1;
  };

  var legend2 = L.control({position: 'bottomleft'});

  legend2.onAdd = function (map) {

    var div2 = L.DomUtil.create('div', 'info legend2'),
        grades2 = [1, 10, 20, 30, 40, 50, 75, 90],
        labels2 = [];
    for (var i = 0; i < grades2.length; i++) {
        div2.innerHTML += '<i style="background:' + chooseColor(grades2[i], 100) + '"></i> ' +
        grades2[i] + (grades2[i + 1] ? '&ndash;' + grades2[i + 1] + '<br>' : '+');
    }

    return div2;
  };

  legend1.addTo(map1);
  legend2.addTo(map2);
  plot(map1,'order_66');
  plot(map2,'order_66');
};

init()

// plot(map1, document.getElementById("selData1").value)
document.getElementById("selData1").addEventListener("change", changeDrop1);
document.getElementById("selData2").addEventListener("change", changeDrop2);

function changeDrop1() {
  plot(map1, document.getElementById("selData1").value)
};
function changeDrop2() {
  plot(map2, document.getElementById("selData2").value)
};