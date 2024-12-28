const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
    .then(response => response.json())
    .then(data => {
        // console.log(data);

        const width = 800;
        const height = 600;
        const margin = { top: 50, right: 50, bottom: 50, left: 70 };

        const xRange = d3.extent(data, d => d.Year);
        const yRange = d3.extent(data, d => d.Seconds);

        const xOffsetDynamic = (xRange[1] - xRange[0]) * 0.05;
        const yOffsetDynamic = (yRange[1] - yRange[0]) * 0.11;

        const svg = d3.select("#scatter-plot")
            .attr("width", width)
            .attr("height", height);

        const xScale = d3.scaleTime()
            .domain([
                new Date(xRange[0] - xOffsetDynamic, 0),
                new Date(xRange[1] + xOffsetDynamic, 0)])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleTime()
            .domain([
                new Date(0, 0, 0, 0, Math.ceil(yRange[1] / 60), yRange[1] % 60 - yOffsetDynamic),
                new Date(0, 0, 0, 0, Math.floor(yRange[0] / 60), yRange[0] % 60 - yOffsetDynamic)])
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));

        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")));

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(new Date(d.Year, 0)))
            .attr("cy", d => yScale(new Date(0, 0, 0, 0, d.Seconds / 60, d.Seconds % 60)))
            .attr("r", 5)
            .attr("data-xvalue", d => d.Year)
            .attr("data-yvalue", d => new Date(0, 0, 0, 0, d.Seconds / 60, d.Seconds % 60))
            .style("fill", d => d.Doping == "" ? "orange" : "blue")
            .on("mouseover", (event, d) => {


                const [x, y] = d3.pointer(event, svg.node());
                const svgWidth = svg.node().getBoundingClientRect().width;

                const isRightHalf = x > svgWidth / 2;
                const tooltipOffsetX = isRightHalf ? -150 : 10;
                const tooltipOffsetY = 10;

                d3.select("#tooltip")
                    .style("visibility", "visible")
                    .attr("data-year", d.Year)
                    .html(`Year: ${d.Year}<br>Time: ${d.Time}  <br>${d.Doping}`);

            })
            .on("mousemove", (event) => {
                const [x, y] = d3.pointer(event, svg.node());
                const svgWidth = svg.node().getBoundingClientRect().width;

                const isRightHalf = x > svgWidth / 2;
                const tooltipOffsetX = isRightHalf ? -90 : 10;
                const tooltipOffsetY = 10;

                d3.select("#tooltip")
                    .style("left", `${event.pageX + tooltipOffsetX}px`)
                    .style("top", `${event.pageY + tooltipOffsetY}px`);
            })
            .on("mouseout", () => {
                d3.select("#tooltip").style("visibility", "hidden");
            });

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 10)
            .attr("text-anchor", "middle")
            .text("Year");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .text("Time in Minutes");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("id", "title")
            .text("Doping in Professional Bicycle Racing");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 40)
            .attr("text-anchor", "middle")
            .attr("id", "subtitle")
            .text("35 Fastest times up Alpe d'Huez");
    })
    .catch(error => console.error('Error fetching data:', error));
