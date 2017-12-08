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
    };

init();