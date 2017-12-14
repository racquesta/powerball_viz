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


function getStateColorIndex(statesArray){
    var colors = [];
    _.each(statesArray, function(item){
        console.log(color_num[item])
        colors.push(color_num[item])
    });
    return colors
};

// function getColorArray(num) {
//     var result = [];
//     for (var i = 0; i < num; i += 1) {
//         var letters = '0123456789ABCDEF'.split('');
//         var color = '#';
//         for (var j = 0; j < 6; j += 1) {
//             color += letters[Math.floor(Math.random() * 16)];
//         }
//         result.push(color);
//     }
//     return result;
// }

// colors = getColorArray(52)

// color_dict =
//         {'Alabama': colors[0],
//           'Alaska': colors[1],
//           'American Samoa': colors[2],
//           'Arizona': colors[3],
//           'Arkansas': colors[4],
//           'California': colors[5],
//           'Colorado': colors[6],
//           'Connecticut': colors[7],
//           'Delaware': colors[8],
//           'District Of Columbia': colors[9],
//           'Florida': colors[10],
//           'Georgia': colors[11],
//           'Idaho': colors[12],
//           'Illinois': colors[13],
//           'Indiana': colors[14],
//           'Iowa': colors[15],
//           'Kansas': colors[16],
//           'Kentucky': colors[17],
//           'Louisiana': colors[18],
//           'Maine': colors[19],
//           'Maryland': colors[20],
//           'Massachusetts': colors[21],
//           'Michigan': colors[22],
//           'Minnesota': colors[23],
//           'Mississippi': colors[24],
//           'Missouri': colors[25],
//           'Montana': colors[26],
//           'Nebraska': colors[27],
//           'Nevada': colors[28],
//           'New Hampshire': colors[29],
//           'New Jersey': colors[30],
//           'New Mexico': colors[31],
//           'New York': colors[32],
//           'North Carolina': colors[33],
//           'North Dakota': colors[34],
//           'Northern Mariana Islands': colors[35],
//           'Ohio': colors[36],
//           'Oklahoma': colors[37],
//           'Oregon': colors[38],
//           'Pennsylvania': colors[39],
//           'Puerto Rico': colors[40],
//           'Rhode Island': colors[41],
//           'South Carolina': colors[41],
//           'South Dakota': colors[42],
//           'Tennessee': colors[43],
//           'Texas': colors[44],
//           'Utah': colors[45],
//           'Vermont': colors[46],
//           'Virgin Islands': colors[47],
//           'Virginia': colors[48],
//           'Washington': colors[49],
//           'West Virginia': colors[50],
//           'Wisconsin': colors[51],
//           'Wyoming': colors[52]
//         }
console.log("js is working!")

function init(){
    d3.json("/jackpots/all/jackpot/ticket_sales", function(error, response) {
        
            if (error) return console.warn(error);
        
            console.log(response);
        
            var trace1 = {
                x: response['jackpot'],
                y: response['ticket_sales'],
                mode: 'markers',
                marker: {
                    colorscale: 'RdBu',
                    color: response['jackpot_run_id']
                },
                name: response['date_format'],
                text: response['drawings_since_jackpot'],
                type: 'scatter'
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
                title: "Total Ticket Sales versus Jackpot Amount <br>  2010-2015",
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
                  }
                
              };
              var data = [trace1];
              
              Plotly.newPlot('graph', data, layout);
            
        });

    d3.json("/soc_data/all/Poverty Rate/norm_tick_sales", function(error, response){

        if (error) return console.warn(error);

        console.log(response)
        
        
        colorArray = getStateColorIndex(response['state'])

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
            text: response['state'],
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
              }
            
          };
          
          
          Plotly.plot('soc_graph', data, layout);
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
})

init();