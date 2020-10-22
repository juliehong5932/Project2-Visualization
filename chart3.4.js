d3.json("data/merged_data1.json").then((imported_data) => {
    console.log(imported_data);
    var data = imported_data;

    // Read key
    for (var key in data) {
       console.log(key);
       console.log(data[key]);
   }

    var state_code = data.map(row => row.state_code);
    var seventeen_average = data.map(row => row.seventeen_average);
    var median_income = data.map(row => row.median_income);
    var percent_hs_grad = data.map(row => row.percent_hs_grad);
    var homicide_rate = data.map(row => row.homicide_rate);
    // var firearms_death_rate = data.map(row => row.firearms_death_rate);
    

    var trace1 = {
        x: state_code,
        y: homicide_rate,
        xaxis: 'x',
        yaxis: 'y',
        type: 'scatter',
        name: 'Homicide Rate %',
        connectgaps: true
      };
      
      var trace2 = {
        x: state_code,
        y: seventeen_average,
        xaxis2: 'x2',
        yaxis: 'y2',
        type: 'scatter',
        name: 'Poverty % 2017-18',
        connectgaps: true
      };
      
      var trace3 = {
        x: state_code,
        y: median_income,
        xaxis: 'x3',
        yaxis: 'y3',
        type: 'scatter',
        name: 'Median Income',
        connectgaps: true
      };
      var trace4 = {
        x: state_code,
        y: percent_hs_grad,
        xaxis: 'x4',
        yaxis: 'y4',
        type: 'scatter',
        name: 'H.S Graduation %',
        connectgaps: true
      };

      var data = [trace1, trace2, trace3, trace4];
    
      var layout = {
        grid: {
          rows: 4,
          columns: 1,
          pattern: 'dependent',
          roworder: 'bottom to top'
        },
        legend:{
          traceorder : 'normal',
          showlegend : 'True',
        },
        xaxis: {
          showgrid: true,
          zeroline: false,
          showline: false,
          mirror: 'ticks',
          gridcolor: '#bdbdbd',
          gridwidth: 1.5,
          zerolinecolor: '#969696',
          zerolinewidth: 4,
          linecolor: '#636363',
          linewidth: 14
        },
        xaxis2: {
          showgrid: true,
          zeroline: false,
          showline: false,
          mirror: 'ticks',
          gridcolor: '#bdbdbd',
          gridwidth: 1.5,
          zerolinecolor: '#969696',
          zerolinewidth: 4,
          linecolor: '#636363',
          linewidth: 14
        },
        xaxis3: {
          showgrid: true,
          zeroline: false,
          showline: false,
          mirror: 'ticks',
          gridcolor: '#bdbdbd',
          gridwidth: 1.5,
          zerolinecolor: '#969696',
          zerolinewidth: 4,
          linecolor: '#636363',
          linewidth: 14
        },
        xaxis4: {
          showgrid: true,
          zeroline: false,
          showline: false,
          mirror: 'ticks',
          gridcolor: '#bdbdbd',
          gridwidth: 1.5,
          zerolinecolor: '#969696',
          zerolinewidth: 4,
          linecolor: '#636363',
          linewidth: 14
        },
    };      
      Plotly.newPlot('plot', data, layout);
});