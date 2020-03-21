// @TODO: YOUR CODE HERE!
var svgWidth = parseInt(d3.select("#scatter").style("width")); //960;
var svgHeight = 500; //parseInt(d3.select("#scatter").style("height")); //500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
//var chosenXAxis = "age"; //?? // TODO: delete
var chosenYAxis =  "healthcare"; //"obesity";

// function used for updating x-scale var upon click on axis label
function xScale(povertyData, chosenXAxis, width) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(povertyData, d => d[chosenXAxis]) * 0.8,
      d3.max(povertyData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(povertyData, chosenYAxis, height) {
  var yLinearScale = d3.scaleLinear()
    /*.domain([d3.min(povertyData, d => d[chosenYAxis]) * 0.8,
      d3.max(povertyData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);*/
    .domain([0, d3.max(povertyData, d => d[chosenYAxis])])
    .range([height, 0]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var axisLeft = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(axisLeft);

  return yAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderCirclesXY(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis, circlesGroupLabel) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

   circlesGroupLabel.transition()
    .duration(1000)
    .attr("x", (d) => newXScale(d[chosenXAxis]) - 5)
    .attr("y", (d) => newYScale(d[chosenYAxis]) + 5);

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var label;
  var labelY;

  if (chosenXAxis === "poverty") {
    label = "Poverty (%): ";
  } else if (chosenXAxis === "age") {
    label = "Age (Median): ";    
  } else if (chosenXAxis === "income") {
    label = "Household Income (Median): ";    
  }

  if (chosenYAxis === "healthcare") {
    labelY = "Lack of Healthcare (%): ";
  } else if (chosenYAxis === "smokes") {
    labelY = "Smokes (%) ";    
  } else if (chosenYAxis === "obesity") {
    labelY = "Obesity (%): ";    
  }


  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>${labelY} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
    //alert("USA");
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

function draw_plot(do_resize) {

  // @TODO: YOUR CODE HERE!
  /*var svgWidth = 960;
  var svgHeight = 500;

  var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
  var chosenXAxis = "poverty";
  //var chosenXAxis = "age"; //?? // TODO: delete
  var chosenYAxis =  "healthcare"; //"obesity";*/

  //var do_resize = true;

  if (do_resize) {
    svgWidth = parseInt(d3.select("#scatter").style("width"));
    svgHeight = svgWidth - svgWidth / 3.9; 
    
    width = svgWidth - margin.left - margin.right;
    //height = width - width / 3.9;      
    height = svgHeight - margin.top - margin.bottom;

    d3.select("svg").remove();

    svg = d3
      .select(".chart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    //svg.attr("width", width);

    chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  }

  var circle_radius = 15;

  if (width < 500) {
    circle_radius = 7.5;
  }

  // Retrieve data from the CSV file and execute everything below
  d3.csv("assets/data/data.csv").then(function(povertyData, err) {
    //alert(data);
    if (err) throw err;

    // parse data
    povertyData.forEach(function(data) {
      // x-axis
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;

      // y-axis
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(povertyData, chosenXAxis, width);
    var yLinearScale = yScale(povertyData, chosenYAxis, height);

    // Create y scale function
    /*var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(povertyData, d => d.healthcare)])
      .range([height, 0]);*/

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    //chartGroup.append("g")
    //  .call(leftAxis);

    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .attr("transform", `translate(0, 0)`)
      .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(povertyData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
      //.attr("cy", d => yLinearScale(d.healthcare))
      .attr("cy", (d) => yLinearScale(d[chosenYAxis]))
      .attr("r", circle_radius)
      .attr("fill", "blue")
      .attr("opacity", "0.3");

    var circlesGroupLabel = chartGroup.append("g").selectAll("text")
      .data(povertyData)
      .enter()  
      .append("text")
      .attr("x", (d) => xLinearScale(d[chosenXAxis]) - 5)
      .attr("y", (d) => yLinearScale(d[chosenYAxis]) + 5)
      .attr("font-size", "9px")
      //.text("US");
      .text((d) => d["abbr"]);    
    

    // Create group for 3 x- axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var incomdeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");

    // Create group for 3 y- axis labels
    var healthcareLabel = labelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - width/2 - 80)
      .attr("x", height/2)
      .attr("valueY", "healthcare")
      .classed("active", true)
      .text("Lack of Healthcare (%)");

    var smokesLabel = labelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - width/2 - 60)
      .attr("x", height/2)
      .attr("valueY", "smokes")
      .classed("inactive", true)
      .text("Smokes (%)");

    var obesityLabel = labelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - width/2 - 40)
      .attr("x", height/2)
      .attr("valueY", "obesity")
      .classed("inactive", true)
      .text("Obesity (%)");
  
    // changes classes to change bold text 

    // X-axis
    if (chosenXAxis === "poverty") {
      povertyLabel
        .classed("active", true)
        .classed("inactive", false);
      ageLabel 
        .classed("active", false)
        .classed("inactive", true);
      incomdeLabel 
        .classed("active", false)
        .classed("inactive", true);  
    } else if (chosenXAxis === "age") {
      ageLabel
        .classed("active", true)
        .classed("inactive", false);
      povertyLabel 
        .classed("active", false)
        .classed("inactive", true);
      incomdeLabel 
        .classed("active", false)
        .classed("inactive", true);
    } else if (chosenXAxis === "income") {
      incomdeLabel
        .classed("active", true)
        .classed("inactive", false);
      povertyLabel 
        .classed("active", false)
        .classed("inactive", true);
      ageLabel 
        .classed("active", false)
        .classed("inactive", true);
    }

    // Y-axis
    if (chosenYAxis === "healthcare") {
      healthcareLabel
        .classed("active", true)
        .classed("inactive", false);
      smokesLabel 
        .classed("active", false)
        .classed("inactive", true);
      obesityLabel 
        .classed("active", false)
        .classed("inactive", true);  
    } else if (chosenYAxis === "smokes") {
      smokesLabel
        .classed("active", true)
        .classed("inactive", false);
      healthcareLabel 
        .classed("active", false)
        .classed("inactive", true);
      obesityLabel 
        .classed("active", false)
        .classed("inactive", true);
    } else if (chosenYAxis === "obesity") {
      obesityLabel
        .classed("active", true)
        .classed("inactive", false);
      healthcareLabel 
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel 
        .classed("active", false)
        .classed("inactive", true);
    }
    
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        //alert(value);
        //alert(chosenXAxis);

        var valueY = d3.select(this).attr("valueY");
        //alert(valueY);
        //alert(chosenYAxis);

        if ((value !== chosenXAxis) || (valueY !== chosenYAxis)) { // check change event

          // replaces chosenXAxis with value

          if (value !== null) {
            chosenXAxis = value;
          }

          if (valueY !== null) {
            chosenYAxis = valueY;    
          }

          // console.log(chosenXAxis)

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(povertyData, chosenXAxis, width);

          yLinearScale = yScale(povertyData, chosenYAxis, height);
         

          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);

          yAxis = renderYAxes(yLinearScale, yAxis);          

          // updates circles with new x values
          //circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

          circlesGroup = renderCirclesXY(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis, circlesGroupLabel);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
         

          // changes classes to change bold text 

          // X-axis
          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel 
              .classed("active", false)
              .classed("inactive", true);
            incomdeLabel 
              .classed("active", false)
              .classed("inactive", true);  
          } else if (chosenXAxis === "age") {
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel 
              .classed("active", false)
              .classed("inactive", true);
            incomdeLabel 
              .classed("active", false)
              .classed("inactive", true);
          } else if (chosenXAxis === "income") {
            incomdeLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel 
              .classed("active", false)
              .classed("inactive", true);
            ageLabel 
              .classed("active", false)
              .classed("inactive", true);
          }

          // Y-axis
          if (chosenYAxis === "healthcare") {
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel 
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel 
              .classed("active", false)
              .classed("inactive", true);  
          } else if (chosenYAxis === "smokes") {
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            healthcareLabel 
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel 
              .classed("active", false)
              .classed("inactive", true);
          } else if (chosenYAxis === "obesity") {
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            healthcareLabel 
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel 
              .classed("active", false)
              .classed("inactive", true);
          }

        }
      });
       
  }).catch(function(error) {
    console.log(error);
  });

} // draw_plot

draw_plot(false);

d3.select(window).on("resize", function() {
  //alert("Resize.");
  draw_plot(true);
});