states = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Dist. of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
//  create a consistent array of color indices for us states
color_num = {}
count = 1
_.each(states, function(item){
    if(!color_num[item]){
    color_num[item] = count
    count += 11
    }
})
console.log(color_num)

function jackpotReduce(jackpotarray){
    jackpot_reduced = []
    for(i=0; i<jackpotarray.length; i++){
        var value = jackpotarray[i]/15;
        jackpot_reduced.push(value)
    }
    return jackpot_reduced
}
function getStateColorIndex(statesArray){
    var colors = [];
    _.each(statesArray, function(item){
        console.log(color_num[item])
        colors.push(color_num[item])
    });
    return colors
};

function createHoverData(zarray, itemText, dateArray, dateText){
    hoverText = [];
    for(var i = 0; i<zarray.length; i++){
        var oneTool = itemText +  zarray[i] + "<br>" + dateText + dateArray[i];
        hoverText.push(oneTool);
    };
    return hoverText
}

function colorIndex(arg){
    new_index = [arg[1]]
    for(i=0; i< arg.length; i++){
        var new_num = arg[i]/arg[1] *100
        new_index.push(new_num)
    }
    return new_index
}
console.log("js is working!")

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
          name: 'Base/Draw Ticket Sales',
          type: 'bar',
          marker: {color: "#c61633", opacity: .75}
          
          
        };
        var trace_pp = {
          x: state_names,
          y: state_pp_sales,
          name: 'Power Play Sales',
          type: 'bar',
          marker: {color: "darkslateblue",
        opacity: .75}
        };
        var data = [trace_draw, trace_pp];
        var layout = {
          title: "2010 Ticket Sales Per Capita",
          barmode: 'stack',
          showlegend: true,
          xaxis: {
            tickangle: -45
          },
          yaxis: {
            zeroline: false,
            gridwidth: 2
          },
          bargap :0.1,
          font: {
              family: "Pacifico",
              size: 13
          },
          margin: 
          {
              top: 10,
              bottom: 2,
              right: 10,
              left: 10
          }
        }; 
        Plotly.newPlot("bar", data, layout);         
            });

    d3.json("/jackpots/all/jackpot/ticket_sales", function(error, response) {
        
            if (error) return console.warn(error);
        
            console.log(response);

            hoverInfo = createHoverData(response['drawings_since_jackpot'], "Drawings Since Jackpot Winner: ", response['date_format'], "Date: ")
            colors = colorIndex(response['jackpot_run_id'])
            jackpot_size = jackpotReduce(response['jackpot'])

            console.log(jackpot_size)
            var trace1 = {
                x: response['jackpot'],
                y: response['ticket_sales'],
                mode: 'markers',
                marker: {
                    colorscale: 'RdBu',
                    color: colors,
                    opacity: .75,
                    size: jackpot_size
                },
                name: response['date_format'],
                text: hoverInfo,
                type: 'scatter',
              };

              
              var layout = {
                hovermode: 'closest',
                hoverinfo: 'name+text',
                showlegend: false,
                height: 600,
                // width: 1200
                margin: 
                    {
                        top: 10,
                        bottom: 10,
                        right: 10,
                        left: 10
                    },
                title: "Total Ticket Sales versus Jackpot Value <br>  2010-2015",
                font: {
                    family: "Pacifico",
                    size: 15,
                    
                },
                xaxis: {
                    title: "Jackpot Value",
                    showline: true,
                    zeroline: false,
                    autorange: true
                },
                yaxis: {
                    title: "Ticket Sale Per Capita",
                    showline: true,
                    zeroline: false,
                    autorange: true
                },
                transition: {
                    duration: 500,
                    easing: 'cubic-in-out'
                  }
                
              };
              var data = [trace1];
              
              Plotly.newPlot('graph', data, layout);
            
        });

    d3.json("/soc_data/all/Poverty Rate/norm_tick_sales", function(error, response){

        if (error) return console.warn(error);

        console.log(response)
        
        
        colorArray = getStateColorIndex(response['state'])

        hoverInfo = createHoverData(response['state'], "", response['year'], "");

        console.log(hoverInfo)
        console.log(colorArray)
        // colors_list = []
        // for(var i=0; i<response["states"].length; i++){
        //     colors_list.push(color_dict[response["states"][i]])
        // }
        //console.log(sizes)
        var trace1 = {
            x: response['independent'],
            y: response['dependent'],
            mode: 'markers',
            marker: {
                colorscale: "RdBu",
                color: colorArray,
                size: 15,
                opacity: .75
            },
            text: hoverInfo,
            type: "scatter"
          };
          
          var data = [trace1];
          
          var layout = {
            hovermode: 'closest',
            showlegend: false,
            height: 600,
            // width: 1200
            margin: 
                {
                    top: 10,
                    bottom: 10,
                    right: 10,
                    left: 10
                },
            title: "Ticket Sales Per Capita versus Poverty Rate <br>  2010-2015",
            xaxis: {
                title: "Poverty Rate (%)",
                showline: true
            },
            yaxis: {
                title: "Ticket Sale Per Capita",
                showline: true
            },
            transition: {
                duration: 500,
                easing: 'cubic-in-out'
              },
            font: {
                family: "Pacifico",
                size: 15,
                
            },
            
          };
          
          
          Plotly.newPlot('soc_graph', data, layout);
    })
    };

d3.select("#soc_graph_submit").on("click", function(){

    d3.event.preventDefault();

    var yaxis = d3.select("#depVar").property("value")
    var xaxis = d3.select("#indVar").property("value")
    var year = d3.select("#socYears").property("value")

    console.log(year)
    console.log(typeof year)
    switch (year){
        case "2010-2015":
            var chosen_year = "all";
            break;
        default:
            var chosen_year = year;
    };

    switch (yaxis){
        case "Ticket Sales Per Capita":
            var dep_var = "norm_tick_sales";
            var max_y = 26;
            break;
        default:
            var dep_var = "norm_revenue"
            var max_y = 40
        
    };

    switch (xaxis){
        case "Median Income":
            var data_point = "Household Income";
            break;
        default:
            var data_point = xaxis;
    }

    console.log(chosen_year)
    console.log(xaxis)
    console.log(dep_var)

    var route = "/soc_data/" + chosen_year + "/" + data_point + "/" + dep_var;
    console.log(route)
    d3.json(route, function(error, response){

        if (error) return console.warn(error);

        var new_x = response['independent'];
        var new_y = response['dependent'];
        var new_title = yaxis + " Vs. " + xaxis + "<br>" + year;
        var new_x_title = xaxis;
        var new_y_title = yaxis;
        var new_state_names = response['state']

        var new_colors = getStateColorIndex(response['state'])

        console.log(new_x)
        console.log(new_y)
        console.log(new_title)
        console.log(new_x_title)
        console.log(new_y_title)

        // Plotly.restyle('soc_graph', 'x', [new_x]);
        // Plotly.restyle('soc_graph', 'y', [new_y])
        // Plotly.restyle('soc_graph', 'markers.color', [new_colors])
        // Plotly.relayout('soc_graph', 'title', new_title)
        // Plotly.relayout('soc_graph', 'xaxis.title', new_x_title )

        function myArrayMax(arr) {
            var len = arr.length
            var max = -Infinity;
            while (len--) {
                if (arr[len] > max) {
                    max = arr[len];
                }
            }
            return max;
        }
        

        function myArrayMin(arr) {
            var len = arr.length
            var min = Infinity;
            while (len--) {
                if (arr[len] < min) {
                    min = arr[len];
                }
            }
            if (min < 5){
                min = 5;
            }
            return min;
        }

        var min_x = myArrayMin(new_x)
        var max_x = myArrayMax(new_x)
        
        var max_y_tickets = 25
        console.log("max" + max_y_tickets)
        var max_y_dollars = 37
        console.log("max $" + max_y_dollars)
        console.log(min_x)
        console.log(max_x)

        var buffer = 5;

        if (min_x >10000){
            buffer = 1000
        } ;
        if (min_x > 100000) {
            mix_x = 0
        };

    

        console.log(buffer)
        Plotly.animate('soc_graph', {
            data: [{x: new_x, 
                y: new_y,
                text: new_state_names,
                markers: {
                    color: new_colors
                }}],
            layout: {
                title: new_title,
                xaxis: {
                    title: new_x_title,
                    range: [min_x - buffer, max_x + buffer]
                },
                yaxis: {
                    title: new_y_title,
                    range: [0, max_y]
                }
            }
          }, {
            transition: {
              duration: 500,
              easing: 'cubic-in-out'
            }
          })
    })
});


d3.select("#jack_graph_submit").on("click", function(){
    
    d3.event.preventDefault();
    
        var yaxis = d3.select("#jackY").property("value")
        var xaxis = d3.select("#jackX").property("value")
        var year = d3.select("#jackYears").property("value")
    
        console.log(year)
        console.log(typeof year)
        switch (year){
            case "2010-2015":
                var chosen_year = "all";
                break;
            default:
                var chosen_year = year;
        };
    
        switch (yaxis){
            case "Ticket Sales":
                var dep_var = "ticket_sales";
                // var max_y = 26;
                break;
            case "Jackpot Value":
                var dep_var = "jackpot";
                // var max_y = 26;
                break;
            case "Power Play Sales ($)":
                var dep_var = "state_pp_sales";
                // var max_y = 26;
                break;
            case "Base/Draw Ticket Sales ($)":
                var dep_var = "state_draw_sales";
                // var max_y = 26;
                break;
            case "Total Sales ($)":
                var dep_var = "revenue";
                // var max_y = 26;
                break;
            default:
                var dep_var = "revenue"
                // var max_y = 40
            
        };
    
        switch (xaxis){
            case "Jackpot Value":
                var data_point = "jackpot";
                break;
            case "Date":
                var data_point = "date_format";
                break;
            default:
                var data_point = "drawings_since_jackpot";
        }
    
        console.log(chosen_year)
        console.log(xaxis)
        console.log(dep_var)
    
        var route = "/jackpots/" + chosen_year + "/" + data_point + "/" + dep_var;
        console.log(route)
        d3.json(route, function(error, response){
    
            if (error) return console.warn(error);
    
            var new_x = response[data_point];
            var new_y = response[dep_var];
            var new_title = yaxis + " Vs. " + xaxis + "<br>" + year;
            var new_x_title = xaxis;
            var new_y_title = yaxis;
    
    
            console.log(new_x)
            console.log(new_y)
            console.log(new_title)
            console.log(new_x_title)
            console.log(new_y_title)
            
            hoverInfo = createHoverData(response['drawings_since_jackpot'], "Drawings Since Jackpot Winner: ", response['date_format'], "Date: ")

            colors_new = colorIndex(response['jackpot_run_id'])
            console.log(colors_new)       
            
            jackpot_size_new = jackpotReduce(response['jackpot'])
            console.log(jackpot_size_new)
            // 
            var trace1 = {
                x: new_x,
                y: new_y,
                mode: 'markers',
                marker: {
                    colorscale: 'RdBu',
                    color: colors_new,
                    opacity: .75,
                    size: jackpot_size_new
                },
                name: response['date_format'],
                text: hoverInfo,
                type: 'scatter',
              };

              
              var layout = {
                hovermode: 'closest',
                hoverinfo: 'name+text',
                showlegend: false,
                height: 600,
                // width: 1200
                margin: 
                    {
                        top: 10,
                        bottom: 10,
                        right: 10,
                        left: 10
                    },
                title: new_title,
                font: {
                    family: "Pacifico",
                    size: 15,
                    
                },
                xaxis: {
                    title: new_x_title,
                    showline: true,
                    zeroline: false,
                    autorange: true
                },
                yaxis: {
                    title: new_y_title,
                    showline: true,
                    zeroline: false,
                    autorange: true
                },
                transition: {
                    duration: 500,
                    easing: 'cubic-in-out'
                  }
                
              };
              var data = [trace1];
              Plotly.newPlot('graph', data, layout)
            // Plotly.restyle('graph', update, [0])
            // Plotly.restyle('graph', 'x', [new_x]);
            // Plotly.restyle('graph', 'y', [new_y])
            // Plotly.restyle('graph', 'text', [hoverInfo])
            // Plotly.restyle('graph', 'markers.color', [colors_new])
            // Plotly.relayout('graph', 'title', new_title)
            // Plotly.relayout('graph', 'xaxis.title', new_x_title)
            // Plotly.relayout('graph', 'yaxis.title', new_y_title)
            // Plotly.restyle('graph', 'markers.size', jackpot_size_new)
    
        });
    });
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
        name: 'Base/Draw Ticket Sales',
        type: 'bar',
        marker: {color: "#c61633", opacity: .75}
    };
        var $trace_pp = {
        x: $state_names,
        y: $state_pp_sales,
        name: 'Power Play Sales',
        type: 'bar',
        marker: {color: "darkslateblue", opacity: .75}
    };
    
    var newData = [$trace_draw, $trace_pp];
    updatePlotly(newData, dataset);
        });  
    };
    
function updatePlotly(newBardata, dataset) {
    var BAR= document.getElementById("bar");
    var layout = {
        title: dataset + " Ticket Sales Per Capita",
        barmode: 'stack',
        showlegend: true,
        xaxis: {
            tickangle: -45
        },
        yaxis: {
            zeroline: false,
            gridwidth: 2
        },
        bargap :0.1,
        font: {
            family: "Pacifico",
            size: 15
        }
        };
        Plotly.newPlot(BAR, newBardata, layout);
    };
init();