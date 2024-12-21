const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        const width = 800;
        const height = 500;
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const svg = d3.select("#scatter-plot")
            .attr("width", width)
            .attr("height", height);

        const xScale = d3.scaleTime()
            .domain([d3.min(data, d => new Date(d.Year - 1, 0)), d3.max(data, d => new Date(d.Year + 1, 0))])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleTime()
            .domain([d3.min(data, d => new Date(0, 0, 0, 0, d.Seconds / 60, d.Seconds % 60)), d3.max(data, d => new Date(0, 0, 0, 0, d.Seconds / 60, d.Seconds % 60))])
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));

        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")));

    })
    .catch(error => console.error('Error fetching data:', error));
