d3.json("data/final_merged_data.json").then((imported_data) => {
    console.log(imported_data);
    var data = imported_data;

    for (var key in data) {
       console.log(key);
       console.log(data[key]);}

    var state_code = data.map(row => row.state_code);
    var seventeen_average = data.map(row => row.seventeen_average);
    var median_income = data.map(row => row.median_income);
    var percent_hs_grad = data.map(row => row.percent_hs_grad);
    var homicide_rate = data.map(row => row.homicide_rate);
   //console.log(homicide_rate);
    var trace1 = {
        x: state_code,
        y: homicide_rate,
        xaxis: 'x',
        yaxis: 'y',
        type: 'scatter',
        name: 'Homicide Rate %',
        marker: {
            color: 'rgb(91,166,240)'},
        connectgaps: true
      };
      
      var trace2 = {
        x: state_code,
        y: seventeen_average,
        yaxis: 'y2',
        type: 'scatter',
        name: 'Poverty % 2017-18',
        marker: {
            color: 'rgb(240,101,226)'},
        connectgaps: true
      };
      
      var trace3 = {
        x: state_code,
        y: median_income,
        yaxis: 'y3',
        type: 'scatter',
        name: 'Median Income',
        marker: {
            color: 'rgb(160,32,240)'},
        connectgaps: true
      };
      var trace4 = {
        x: state_code,
        y: percent_hs_grad,
        yaxis: 'y4',
        type: 'scatter',
        name: 'H.S Graduation %',
        marker: {
            color: 'rgb(74,240,85)'},
        connectgaps: true
      };

      var data = [trace1, trace2, trace3, trace4];
    

      

      var layout = {
        grid: {
          rows: 4,
          columns: 1,
          xside: 'bottom',
        },
        xaxis: {
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
        updatemenus: [{
            y: 1,
            buttons: [{
                method: 'restyle',
                args: ['visible', [true, true, true, true]],
                label: 'All',
            }, {
                method: 'restyle',
                args: ['visible', [true, false, false, false]],
                label: 'Homicide Rate',
            }, {
                method: 'restyle',
                args: ['visible', [false, true, false, false]],
                label: 'Poverty Rate % 2017',
            }, {
                method: 'restyle',
                args: ['visible', [false, false, true, false]],
                label: 'Median Income'
            }, {
                method: 'restyle',
                args: ['visible', [false, false, false, true]],
                label: 'H.S Graduation %'
            }]
        }],
    };      
// ------------------------------------------------------------------
    Plotly.newPlot('plot', data, layout,{displayModeBar: false});     
});
