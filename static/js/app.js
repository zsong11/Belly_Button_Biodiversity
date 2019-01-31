function buildMetadata(sample) {
  
  var url = `/metadata/${sample}`;
  
  d3.json(url).then(function(response){
    
    var data = response;
    var PANEL = d3.select("#sample-metadata");
    
    PANEL.html("");
    
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("p")
      .text(`${key}:${value}`);
  });

    
    buildGauge(data.wfreq);
  });
}

function buildCharts(sample) {

  var url = `/samples/${sample}`;
  d3.json(url).then(function (response){
  
    var x_value = response["otu_ids"];
    var y_value = response["sample_values"];
    var size_value = response["sample_values"];
    var label = response["otu_labels"];
    
    var trace1 = {
      x: x_value,
      y: y_value,
      mode:"markers", 
      marker:{
        size: size_value,
        color: x_value,
        colorscale: "Rainbow",
        labels: label,
        type: 'scatter',
        opacity: 0.3
      }
    };

    var data1 = [trace1];

    var layout = {
      title: 'Marker Size',
      xaxis: { title: 'OTU ID' },
      showlegend: true
    };
    Plotly.newPlot("bubble", data1, layout); 


    var data = [{
      values: size_value.splice(0, 10),
      labels: x_value.splice(0, 10),
      text: y_value.splice(0,10),
      type: 'pie'
    }];
    Plotly.newPlot('pie', data);
  });
}

function init() {
  
  var selector = d3.select("#selDataset");

  
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {

  buildCharts(newSample);
  buildMetadata(newSample);
}


init();