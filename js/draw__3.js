//voronoi implementation from here: https://bl.ocks.org/ydeng003/6f973ac9ef0c103ce564406d441f3e7f

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 100);


var seasons,
    seasonKeys,
    seasonParse = d3.timeParse("%Y");


var margin4 = {top: 20, right: 30, bottom: 50, left: 40},
    width4 = d3.select("#fantom").node().getBoundingClientRect().width - margin4.left - margin4.right,
    height4 = 500 - margin4.top - margin4.bottom;


var svg4 = d3.select("#chart_3")
    .attr("width", width4 + margin4.left +  margin4.right)
    .attr("height", height4 + margin4.top + margin4.bottom );



g4 = svg4.append("g").attr("transform", "translate(" + margin4.left + "," + margin4.top + ")");


var line = d3.line()
    .x(function(d) { return x4(d.date); })
    .y(function(d) { return y4(d.value); });


var x4 = d3.scaleTime();


var y4 = d3.scaleLinear()
    .range([height4, 0]);

var z4 = d3.scaleLinear()
    .domain([0, 2, 4, 5, 7, 9])
    .range(['#FD8B7B', "#feaea3", "#FFD65E", '#ffe28e', '#d3d885', '#C0C750']);


g4.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + height4 + ")");


g4.append("g")
    .attr("class", "axis y-axis");


function draw__lineChart(df){

    var data =  df.map(function(d){
        let columns = ["oblast_ua","2016", "2017", "2018", "2019"];
        if (!seasons) {
            seasonKeys = columns.slice(1), seasons = seasonKeys.map(seasonParse);
        }
        var c = {name: d.oblast_ua, values: null};
        c.values = seasonKeys.map(function(k, i) { return {team: c, date: seasons[i], value: d[k] / 1}; });
        return c;
    });

    var new_width =  d3.select("#fantom").node().getBoundingClientRect().width  - margin4.left - margin4.right;

    svg4
        .attr("width", new_width + margin4.left + margin4.right);


    x4.range([0, new_width])
        .domain(d3.extent(seasons));

    y4.domain([0, 9]);


    var voronoi = d3.voronoi()
        .x(function(d) { return x4(d.date); })
        .y(function(d) { return y4(d.value); });


    voronoi
        .extent([[-margin4.left, -margin4.top], [new_width + margin4.right, height4 + margin4.bottom]]);


    g4.select(".axis.x-axis")
        .transition().duration(750)
        .call(d3.axisBottom(x4).ticks(4));



    g4.select('.axis.y-axis')
        .transition().duration(750)
        .call(d3.axisLeft(y4)
            .ticks(10, "#")
            .tickFormat(function(d) { return d + "%"})
        );



    g4.selectAll('.rainbow').remove();

    g4.append("g")
        .attr("class", "teams")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("class", 'rainbow')
        .attr("d", function(d) { d.line = this; return line(d.values); })
        .style("fill", "none")
        .style("stroke", function(d) {
            return z4(d.values[3].value);
        });


    var focus = g4.append("g")
        .attr("transform", "translate(-100,-100)")
        .attr("class", "focus");

    focus.append("circle")
        .attr("r", 6);

    focus.append("text")
        .attr("y", -10);

    var voronoiGroup = g4.append("g")
        .attr("class", "voronoi");

    var voronoi_path = voronoiGroup.selectAll("path")
        .data(voronoi.polygons(d3.merge(data.map(function(d) { return d.values; }))));

    voronoi_path
        .transition().duration(750)
        .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });

    voronoi_path
        .enter().append("path")
        .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    voronoi_path.exit().remove();

    function mouseover(d) {
        let curColor = z4(d.data.value);
        d3.select(d.data.team.line)
            .style('stroke-width', 5)
            .style('stroke', z4(d.data.value));
        d3.select(".focus > circle")
            .style('fill', curColor)
        d.data.team.line.parentNode.appendChild(d.data.team.line);
        focus.attr("transform", "translate(" + x4(d.data.date) + "," + y4(d.data.value) + ")");
        tooltip.transition()
            .duration(200)         // ms delay before appearing
            .style("opacity", 1); // tooltip appears on mouseover
        tooltip.html(d.data.team.name + "<br/> " + d3.timeFormat("%Y")(d.data.date) + " рік: " +  d.data.value + "%")   // add conf and passing attemps to tooltip
            .style("left", (d3.event.pageX + 5) + "px")  // specify x location
            .style("top", (d3.event.pageY - 28) + "px");  // specify y location
    }

    function mouseout(d) {
        d3.select(d.data.team.line).style("stroke-width", 1.5);
        focus.attr("transform", "translate(-100,-100)");
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    }

}



function type(d, i, columns) {
    console.log(d);
    console.log(columns);
    if (!seasons) {
        seasonKeys = columns.slice(1), seasons = seasonKeys.map(seasonParse);
    }
    var c = {name: d.oblast_ua, values: null};
    c.values = seasonKeys.map(function(k, i) { return {team: c, date: seasons[i], value: d[k] / 1}; });
    return c;
}