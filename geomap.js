(function() {

    var width = 800,
        height = 600;

    Promise.all([
        d3.json("./topo.json"),
        d3.csv("./cities.csv"),
        d3.csv("./states.csv")
    ]).then((data) => {

        console.log("All Data:", data);

        const topology = data[0];
        const cities = data[1];
        const states = data[2];

        console.log("Cities:", cities);
        console.log("States:", states);

        console.log("City-State Relationship Example:");
        cities.slice(0,5).forEach((city) => {
            console.log(city.name, "→", city.description);
        });

        const topo = topojson.feature(topology, topology.objects.states);

        const stateDictionary = new Map();
        states.forEach((state) => {
            stateDictionary.set(state.State, +state.Population);
        });

        console.log("State Dictionary:", stateDictionary);

        var blues = d3.scaleSequential()
            .domain(d3.extent(stateDictionary.values()))
            .range(["white", "steelblue"]);

        var projection = d3.geoAlbersUsa()
            .scale(700)
            .translate([487.5, 305]);

        var path = d3.geoPath(projection);

        const svg = d3.select("#geomap")
            .append("g")
            .attr("transform", "translate(50,50)");

        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .join("path")
            .attr("d", path)
            .attr("fill", (d) => {
                const stateName = d.properties.name;
                const pop = stateDictionary.get(stateName);
                return pop ? blues(pop) : "lightgray";
            })
            .attr("stroke", "black")
            .attr("stroke-width", "1px");

        svg.append("g")
            .selectAll("circle")
            .data(cities)
            .join("circle")
            .attr("cx", (d) => projection([+d.longitude, +d.latitude])[0])
            .attr("cy", (d) => projection([+d.longitude, +d.latitude])[1])
            .attr("r", 4)
            .attr("fill", "red");

    });

})();