function getColorArray(num) {
    var result = [];
    for (var i = 0; i < num; i += 1) {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var j = 0; j < 6; j += 1) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        result.push(color);
    }
    return result;
}

colors = getColorArray(52)

color_dict =
        {'Alabama': colors[0],
          'Alaska': colors[1],
          'American Samoa': colors[2],
          'Arizona': colors[3],
          'Arkansas': colors[4],
          'California': colors[5],
          'Colorado': colors[6],
          'Connecticut': colors[7],
          'Delaware': colors[8],
          'District Of Columbia': colors[9],
          'Florida': colors[10],
          'Georgia': colors[11],
          'Idaho': colors[12],
          'Illinois': colors[13],
          'Indiana': colors[14],
          'Iowa': colors[15],
          'Kansas': colors[16],
          'Kentucky': colors[17],
          'Louisiana': colors[18],
          'Maine': colors[19],
          'Maryland': colors[20],
          'Massachusetts': colors[21],
          'Michigan': colors[22],
          'Minnesota': colors[23],
          'Mississippi': colors[24],
          'Missouri': colors[25],
          'Montana': colors[26],
          'Nebraska': colors[27],
          'Nevada': colors[28],
          'New Hampshire': colors[29],
          'New Jersey': colors[30],
          'New Mexico': colors[31],
          'New York': colors[32],
          'North Carolina': colors[33],
          'North Dakota': colors[34],
          'Northern Mariana Islands': colors[35],
          'Ohio': colors[36],
          'Oklahoma': colors[37],
          'Oregon': colors[38],
          'Pennsylvania': colors[39],
          'Puerto Rico': colors[40],
          'Rhode Island': colors[41],
          'South Carolina': colors[41],
          'South Dakota': colors[42],
          'Tennessee': colors[43],
          'Texas': colors[44],
          'Utah': colors[45],
          'Vermont': colors[46],
          'Virgin Islands': colors[47],
          'Virginia': colors[48],
          'Washington': colors[49],
          'West Virginia': colors[50],
          'Wisconsin': colors[51],
          'Wyoming': colors[52]
        }
console.log("js is working!")

function init(){
    d3.json("/jackpot", function(error, response) {
        
            if (error) return console.warn(error);
        
            console.log(response);
        
            var trace1 = {
                x: response['jackpots'],
                y: response['ticket_sales'],
                mode: 'markers',
                type: 'scatter'
              };
              
              var data = [trace1];
              
              Plotly.newPlot('graph', data);
            
        });

    d3.json("/soc_data", function(error, response){

        if (error) return console.warn(error);

        console.log(response)
        
        
        color_num = {}
        count = 1
        _.each(response["state"], function(item){
            if(!color_num[item]){
            color_num[item] = count
            count += 2
            }
        })
        console.log(color_num)
        colors = []
        _.each(response['state'], function(item){
            console.log(color_num[item])
            colors.push(color_num[item])
        })

        console.log(colors)
        // colors_list = []
        // for(var i=0; i<response["states"].length; i++){
        //     colors_list.push(color_dict[response["states"][i]])
        // }
        //console.log(sizes)
        var trace1 = {
            x: response['rate'],
            y: response['norm_ticket_count'],
            mode: 'markers',
            marker: {
                colorscale: "Earth",
                color: colors
                // size: response["jackpot"]
            },
            text: response['state'],
            type: "scatter"
          };
          
          var data = [trace1];
          
          var layout = {
            title: 'Title Here',
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
                }
    
          };
          
          
          Plotly.newPlot('soc_graph', data, layout);
    })
    };



init();