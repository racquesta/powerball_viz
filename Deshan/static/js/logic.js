
// Set up the dropdown menu for the year of sales data
var $selDataset = document.getElementById("selDataset");
d3.json("/years", function(error, response) {
    if (error) return console.log(error);
    var salesYears = response;
for (var i = 0; i < salesYears.length; i++) {
      var saleYear = salesYears[i];
      var $option = document.createElement("option");
      $option.setAttribute("value", saleYear);
      $option.innerHTML = saleYear;
      $selDataset.appendChild($option);
  };
});

//Initail bar chart
function init(){
var $bar = document.getElementById("bar");
var dataUrl = "/sales_data/2010";     
d3.json(dataUrl, function(error, response) {
    if (error) return console.log(error);
    var salesData=[];
    for (i = 0; i < response._id.length; i++) { 
        salesData.push({'state':response._id[i],'draw_sales':response.norm_draw_sales[i],'pp_sales':response.norm_pp_sales[i]});
    };
    var state_names = salesData.map(ayy => ayy.state);
    var state_draw_sales = salesData.map(ayy => ayy.draw_sales);
    var state_pp_sales = salesData.map(ayy => ayy.pp_sales);
    // console.log(state_pp_sales);
    var year= dataUrl;
    var trace_draw = {
	  x: state_names,
	  y: state_draw_sales,
	  name: 'draw_sales',
	  type: 'bar'
	};
    var trace_pp = {
      x: state_names,
      y: state_pp_sales,
      name: 'pp_sales',
      type: 'bar'
	};
    var data = [trace_draw, trace_pp];
    var layout = {
      title: "2010" + " data",
      barmode: 'stack',
      showlegend: true,
      xaxis: {
        tickangle: -45
      },
      yaxis: {
        zeroline: false,
        gridwidth: 2
      },
      bargap :0.1
	}; 
	Plotly.newPlot("bar", data, layout);         
        });
    };

init();

// Bar chart update
function updatePlotly(newBardata, dataset) {
  var BAR= document.getElementById("bar");
  var layout = {
	  title: dataset + " data",
	  barmode: 'stack',
	  showlegend: true,
	  xaxis: {
	    tickangle: -45
	  },
	  yaxis: {
	    zeroline: false,
	    gridwidth: 2
	  },
	  bargap :0.1
	};
   Plotly.newPlot(BAR, newBardata, layout);
  };

// Switch dataset to a new year
function optionChanged(dataset) {
    var newdataUrl = `/sales_data/${dataset}`;             
    d3.json(newdataUrl, function(error, response) {
        if (error) return console.log(error);
        var $salesData=[];
        for (i = 0; i < response._id.length; i++) { 
            $salesData.push({'state':response._id[i],'draw_sales':response.norm_draw_sales[i],'pp_sales':response.norm_pp_sales[i]});
              };
    var $state_names = $salesData.map(ayy => ayy.state);
    var $state_draw_sales = $salesData.map(ayy => ayy.draw_sales);
    var $state_pp_sales = $salesData.map(ayy => ayy.pp_sales);
    var $year=`${dataset}`;
    var $trace_draw = {
	  x: $state_names,
	  y: $state_draw_sales,
	  name: 'draw_sales',
	  type: 'bar'
	};
	  var $trace_pp = {
	  x: $state_names,
	  y: $state_pp_sales,
	  name: 'pp_sales',
	  type: 'bar'
	};
    var newData = [$trace_draw, $trace_pp];
    updatePlotly(newData, dataset);
        });        
}

