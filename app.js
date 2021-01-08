function init() {
    var listener = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var subjectid = data.names;
        subjectid.forEach((sample) => {
        listener
        .append('option')
        .text(sample)
        .property('value', sample);
    });

    var button = subjectid[0];
    buildChart(button)
    updateMetadata(button);


    });
}

 function buildChart(sample) {

    d3.json("samples.json").then(sampledata => {

        var samples = sampledata.samples;
        var filtered_samples = samples.filter(object => object.id == sample);
        var result = filtered_samples[0];

        var sampleValues =  result.sample_values;
        var otu_id = result.otu_ids;
        var labels = result.otu_labels;

    /// bar plot
        var trace = { 
            x: sampleValues.slice(0,10).reverse(),
            y: otu_id.slice(0,10).map(otid => `OTU ${otid}`).reverse(),
            text: labels.slice(1,10).reverse(),
            type: 'bar',
            orientation: 'h'
        };

        var data = [trace];

        var layout = {
            title: "Bar Chart of Top 10 OTU IDs for Sample # " + sample,
            yaxis: {tickmode: 'linear'}
        };

        Plotly.newPlot("bar", data, layout);

    // bubble plot

        var trace = {
            x: otu_id,
            y: sampleValues,
            text: labels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otu_id,
                colorscale: "red"
            }
        };

        var data = [trace];
        var layout = {
            title: "Bacteria Cultures per sample",
            hovermode: 'closest',
            xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
            font: { color: "blue"},
            margin: {t:30}

        };

         Plotly.newPlot('bubble', data, layout); 

    });

function updateMetadata(sample) {
        d3.json("samples.json").then((data) => {
            var metadata = data.metadata;
            var filterArray = metadata.filter(object => object.id.toString() === sample);
            var result = filterArray[0];
            var demo_data = d3.select("#sample-metadata");

            demo_data.html("");

            Object.entries(result).forEach(([key, value]) => {
                demo_data.append("h6").text(`${key}, ${value}`)
            });
    });

}};

function optionChanged(newSample) {
    updateMetadata(newSample);
 
    updateCharts(newSample);
  }
  
  init();
