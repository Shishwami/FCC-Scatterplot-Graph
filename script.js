const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        const width = 800;
        const height = 500;
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const svg = d3.select("#scatterplot")
            .attr("width", width)
            .attr("height", height);




    })
    .catch(error => console.error('Error fetching data:', error));
