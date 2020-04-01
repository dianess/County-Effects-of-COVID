
function buildMetadata(sample) {

  // Build the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json("data/samples.json").then(function(data){

    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");

    // Use `.html("")` to clear any existing metadata
    sample_metadata.html("");

    var metadata = data.metadata;
    var filteredMetadata = metadata.filter(item => item.id == sample)
    var filteredArray = filteredMetadata[0]

    // Use `Object.entries` to add each key and value pair to the panel
    // Inside the loop, append new info for each key-value
    // in the metadata.
    Object.entries(filteredArray).forEach(([key, value]) => {
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);

    })  //ends the Object.entries(filteredArray).forEach...
  }) //ends the section for d3.json
};  //ends the function buildMetadata(sample)

function buildBarChart(sample) {
   // Use `d3.json` to fetch the sample data for the bar chart
   d3.json("data/samples.json").then(function(data) { 
      //console.log(data); 
    var samples = data.samples
    var filterSamples = samples.filter(item => item.id == sample)
      //console.log(filterSamples);
    var ybar = filterSamples[0].otu_ids;
      //console.log(ybar);
    var xbar = filterSamples[0].sample_values;
    var barHover = filterSamples[0].otu_labels;

      // Build a Bar Chart using the sample data
      var trace1 = {
        y: ybar.slice(0, 10).map(object => `OTU ${object}`).reverse(),
        x: xbar.slice(0, 10).reverse(),
        hovertext: barHover.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      }
        var data = [trace1];
        
      // Apply the group bar mode to the layout
      var layout = {
          title: "Top 10 OTUs",
          margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
          }  //ends the margin
        };  //ends the layout
        
        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("plot", data, layout);
});  //ends the section for d3.json
} //ends the function buildBarChart(sample)

// Build the gauge chart
function buildGaugeChart(sample) {
  
   // Use `d3.json` to fetch the metadata
   d3.json("data/samples.json").then(function(data) {
      //console.log(data);  - used to make sure I was getting the data I wanted
    var metadata = data.metadata;
    var filteredMetadata = metadata.filter(item => item.id == sample)
    var filteredArray = filteredMetadata[0]
    var freqValues = filteredArray.wfreq;
      //console.log(freqValues);  used to check the value
    var data = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: freqValues,
        title: { text: "Gauge</b> <br> ", font: { size: 18 } },
        gauge: {
          axis: { range: [null, 9], tickwidth: 1, tickcolor: "black" }, // Max value is 9
          bar: { color: "black" },  // Color of the bar (black) that indicates the washing frequency value
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "black",
          // Set the colors for the different ranges on the gauge
          steps: [
            { range: [0, 1], color: "lightcoral" },
            { range: [1, 2], color: "lightpink" },
            { range: [2, 3], color: "yellowgreen" },
            { range: [3, 4], color: "lightgreen" },
            { range: [4, 5], color: "green" },
            { range: [5, 6], color: "lightblue" },
            { range: [6, 7], color: "cyan" },
            { range: [7, 8], color: "royalblue" },
            { range: [8, 9], color: "blue" }
          ],  //ends the steps: section
        }  //ends the gauge: section
      }  //ends the curly brace after var data [
      
    ];  //ends the bracket with var data [
    
    var layout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial" }
    };  //ends the layout
  
  var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  //plot
  Plotly.newPlot("gauge", data, layout);
  });  // ends d3.json
}  //ends the function buildGaugeChart(sample)

// Build the bubble chart
function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the bubble chart
  d3.json("data/samples.json").then(function(data) {

    var samples = data.samples
    var filterSamples = samples.filter(item => item.id == sample)
      //console.log(filterSamples);
    var ybar = filterSamples[0].otu_ids;

    // Build a Bubble Chart using the sample data
    var xValues = filterSamples[0].otu_ids;
    var yValues = filterSamples[0].sample_values;
    var tValues = filterSamples[0].otu_labels;
    var mSize = filterSamples[0].sample_values;
    var mClrs = filterSamples[0].otu_ids;

    var trace_bubble = {
      x: xValues,
      y: yValues,
      text: tValues,
      mode: 'markers',
      marker: {
        size: mSize,
        color: mClrs
      }  //ends marker:
    };  //ends trace_bubble

    var data = [trace_bubble];

    var layout = {
      xaxis: {title: "OTU ID"}
    }; //ends the layout

    Plotly.newPlot('bubble', data, layout);

  });  //ends the d3.json
}  //ends the function buildCharts(sample)

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("data/samples.json").then((sampleNames) => {
    var names = sampleNames.names;
    names.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    }); //ends the names.forEach...

    // Use the first sample from the list to build the initial plots
    const firstSample = names[0];
    buildBarChart(firstSample);
    buildGaugeChart(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });  //ends the d3.json
};  //ends the function(init()

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildBarChart(newSample);
  buildGaugeChart(newSample);
  buildCharts(newSample);
  buildMetadata(newSample);

}; //ends the function(optionChanged(newSample)

// Initialize the dashboard
init();