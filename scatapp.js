var svgWidth = 960;
var svgHeight = 600;
var margin = {
  top: 30,
  right: 40,
  bottom: 150,
  left: 150
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Initial Params
var chosenXAxis = "firearms_death_rate";
var chosenYAxis = "percent_hs_grad";
// function used for updating x-scale var upon click on axis label
function xScale(mergedData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(mergedData, d => d[chosenXAxis]) * 0.8,
      d3.max(mergedData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
}
function yScale(mergedData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(mergedData, d => d[chosenYAxis]) * 0.8,
      d3.max(mergedData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height,0]);
  return yLinearScale;
}
// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}
function renderAxesY(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}
// function renderStateAbbr(stateAbbr, newXScale, chosenXAxis, newYScale, chosenYAxis) {
//   stateAbbr.transition()
//     .duration(1000)
//     .attr("x", d => newXScale(d[chosenXAxis]))
//     .attr("y", d => newYScale(d[chosenYAxis]));
//   return stateAbbr;
// }
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  var labelx;
  var labely;
  if (chosenXAxis == "firearms_death_rate") {
    labelx = "firearms_death_rate (%):";
  }
  else if(chosenXAxis == "homicide_rate") {
    labelx = "homicide_rate: ";
  }
  else {
    labelx = "household_size: $"
  }
  if (chosenYAxis == "percent_hs_grad") {
    labely = "percent_hs_grad:";
  }
  else if(chosenYAxis == "per_capita_income") {
    labely = "per_capita_income: ";
  }
  else {
    labely = "median_income: "
  }
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    //.offset([80, -60])
    .html(function(d) {
      return (`${d.state_code}<br>${labelx} ${d[chosenXAxis]} <br>${labely} ${d[chosenYAxis]}`);
    });
  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
  return circlesGroup;
}
// Retrieve data from the CSV file and execute everything below
d3.json("../data/final_merged_data.json").then(function(mergedData, err) {
  if (err) throw err;
  // parse data
  mergedData.forEach(function(data) {
    data.firearms_death_rate = +data.firearms_death_rate;
    data.percent_hs_grad = +data.percent_hs_grad;
    data.per_capita_income = +data.per_capita_income;
    data.median_income = +data.median_income;
    data.homicide_rate = +data.homicide_rate;
    data.household_size = +data.household_size;
    //data.abbr = data.abbr;
  });
  console.log(mergedData)
  // xLinearScale function above csv import
  var xLinearScale = xScale(mergedData, chosenXAxis);
  var yLinearScale = yScale(mergedData, chosenYAxis);
  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  // append y axis
 var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);
  // append circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(mergedData)
    .enter()
    .append("circle")
    .attr("class","state_codeCircle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 12)
    .attr("opacity", "0.8")
  // var stateAbbr = chartGroup.selectAll("abbr")
  //   .data(mergedData)
  //   .enter()
  //   .append("text")
  //   .text(d => d.abbr)
  //   .classed("class","StateText")
  //   .attr("cx", d => xLinearScale(d[chosenXAxis]))
  //   .attr("cy", d => yLinearScale(d[chosenYAxis]))
  //   .attr("font-size", "8px")
  // Create group for two x-axis labels
  var labelsGroupX = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  var firearms_death_rateLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "firearms_death_rate") // value to grab for event listener
    .classed("active", true)
    .text("firearms_death_rate (%)");
  var homicide_rateLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "homicide_rate") // value to grab for event listener
    .classed("inactive", true)
    .text("homicide_rate (%) ");
  var household_sizeLabel = labelsGroupX.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "household_size") // value to grab for event listener
  .classed("inactive", true)
  .text("household_size ");
  // append y axis
  var labelsGroupY = chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
  var percent_hs_gradLabel = labelsGroupY.append("text") 
    .attr("value", "percent_hs_grad")
    .attr("dx", "-10em")
    .attr("dy", "-2em")
    .classed("active", true)
    .text("percent_hs_grad (%)");
  var per_capita_incomeLabel = labelsGroupY.append("text") 
  .attr("value", "per_capita_income")
  .attr("dx", "-10em")
  .attr("dy", "-4em")
  .classed("inactive", true)
  .text("per_capita_income");
  var median_incomeLabel = labelsGroupY.append("text") 
  .attr("value", "median_income")
  .attr("dx", "-10em")
  .attr("dy", "-6em")
  .classed("inactive", true)
  .text("median_income %");
  // x axis labels event listener
  labelsGroupX.selectAll("text")
    .on("click", function() {
      // get value of selection
      var xvalue = d3.select(this).attr("value");
      if (xvalue !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = xvalue;
        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(mergedData, chosenXAxis);
        // updates x axis with transition
        xAxis = renderAxesX(xLinearScale, xAxis);
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        //stateAbbr = renderStateAbbr(stateAbbr, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        if (chosenXAxis === "homicide_rate") {
          homicide_rateLabel
            .classed("active",true)
            .classed("inactive", false);
          firearms_death_rateLabel
            .classed("active",false)
            .classed("inactive", true);
          household_sizeLabel
            .classed("active",false)
            .classed("inactive", true);
        } 
        else if(chosenXAxis === "household_size"){
          household_sizeLabel
            .classed("active",true)
            .classed("inactive", false);
          firearms_death_rateLabel
            .classed("active",false)
            .classed("inactive", true);
          homicide_rateLabel
            .classed("active",false)
            .classed("inactive", true);
        } 
        else {
          firearms_death_rateLabel
            .classed("active",true)
            .classed("inactive", false);
          household_sizeLabel
            .classed("active",false)
            .classed("inactive", true);
          homicide_rateLabel
            .classed("active",false)
            .classed("inactive", true);
        }
      }
    })
      labelsGroupY.selectAll("text")
        .on("click", function() {
        // get value of selection
          var yvalue = d3.select(this).attr("value");
          if (yvalue !== chosenYAxis) {
            // replaces chosenXAxis with value
            chosenYAxis = yvalue;
            // functions here found above csv import
            // updates x scale for new data
            yLinearScale = yScale(mergedData, chosenYAxis);
            // updates x axis with transition
            yAxis = renderAxesY(yLinearScale, yAxis);
            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
            //stateAbbr = renderStateAbbr(stateAbbr, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            if (chosenYAxis === "per_capita_income") {
              per_capita_incomeLabel
                .classed("active",true)
                .classed("inactive", false);
              percent_hs_gradLabel
                .classed("active",false)
                .classed("inactive", true);
              median_incomeLabel
                .classed("active",false)
                .classed("inactive", true);
            } 
            else if(chosenYAxis === "median_income"){
              per_capita_incomeLabel
                .classed("active",false)
                .classed("inactive", true);
              percent_hs_gradLabel
                .classed("active",false)
                .classed("inactive", true);
              median_incomeLabel
                .classed("active",true)
                .classed("inactive", false);
            } 
            else {
              per_capita_incomeLabel
                .classed("active",false)
                .classed("inactive", true);
              percent_hs_gradLabel
                .classed("active",true)
                .classed("inactive", false);
              median_incomeLabel
                .classed("active",false)
                .classed("inactive", true);
            }
          }
      })
    }).catch(function(error) {
      console.log(error);
    });
    