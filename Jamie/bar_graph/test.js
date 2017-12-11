// In the actual plot, there would be the years 2010 ~ 2017
// All states that we have data on will go in states_data, and null data would = 0
// Data would be sales/population to simulate how much a person spent on average on power ball tickets that year in that state
var sales_data = [{'year':2010, 'states_data':[{'state':'New Jersey','draw_sales':56,'pp_sales':12},
											{'state':'New York','draw_sales':44,'pp_sales':21},
											{'state':'Florida','draw_sales':61,'pp_sales':9},
											{'state':'Massachusetts','draw_sales':92,'pp_sales':18},
											{'state':'Texas','draw_sales':52,'pp_sales':7}]},
				{'year':2011, 'states_data':[{'state':'New Jersey','draw_sales':48,'pp_sales':14},
											{'state':'New York','draw_sales':82,'pp_sales':21},
											{'state':'Florida','draw_sales':32,'pp_sales':11},
											{'state':'Massachusetts','draw_sales':73,'pp_sales':11},
											{'state':'Texas','draw_sales':62,'pp_sales':8}]},
				{'year':2012, 'states_data':[{'state':'New Jersey','draw_sales':58,'pp_sales':12},
											{'state':'New York','draw_sales':35,'pp_sales':17},
											{'state':'Florida','draw_sales':66,'pp_sales':9},
											{'state':'Massachusetts','draw_sales':77,'pp_sales':23},
											{'state':'Texas','draw_sales':59,'pp_sales':4}]}
				];


for (i = 0; i < sales_data.length; i++) { 
    var state_names = sales_data[i]['states_data'].map(ayy => ayy.state);
    var state_draw_sales = sales_data[i]['states_data'].map(ayy => ayy.draw_sales);
    var state_pp_sales = sales_data[i]['states_data'].map(ayy => ayy.pp_sales);
    var year = sales_data[i]['year']

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
	  title: year + " data",
	  barmode: 'stack',
	  showlegend: false,
	  xaxis: {
	    tickangle: -45
	  },
	  yaxis: {
	    zeroline: false,
	    gridwidth: 2
	  },
	  bargap :0.1
	};
	
	var div = document.createElement('div');
	document.body.appendChild(div);
	var div_id = year + "_data"
	div.id = div_id;

	Plotly.newPlot(div_id, data, layout);

}