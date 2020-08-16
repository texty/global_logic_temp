/**
 * Created by yevheniia on 16.08.20.
 */

const static_margin = {top: 40, right: 50, bottom: 30, left: 80},
    static_width = d3.select("#fantom").node().getBoundingClientRect().width - static_margin.left - static_margin.right,
    static_height = 200 - static_margin.top - static_margin.bottom;


const svg_static = d3.select("#chart_static")
    .attr("class", "svg-wrapper")
    .attr("width", static_width + static_margin.left + static_margin.right)
    .attr("height", static_height + static_margin.top + static_margin.bottom)
    .append("g")
    .attr("transform", "translate(" + static_margin.left + "," +  static_margin.top + ")");

var static_xScale = d3.scaleLinear();
var static_yScale = d3.scaleBand().range([0, static_height]);

//Add group for the x axis
svg_static
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

//Add group for the y axis
svg_static.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(-5,0)");


function draw__static(){
    
    const data = [
        {"misto": "Одеса", "percent": 6.4 },
        {"misto": "Дніпро", "percent": 13.9 },
        {"misto": "Київ", "percent": 16.1 },
        {"misto": "Харків", "percent": 16.4 },
        {"misto": "Львів", "percent": 18.9 }
    ];
    
    var new_width =  d3.select("#fantom").node().getBoundingClientRect().width - static_margin.left - static_margin.right;

    d3.select("#chart_static")
        .attr("width", new_width + static_margin.left + static_margin.right);


    //Update the scales
    static_xScale
        .range([0, new_width - static_margin.left])
        .domain([0, d3.max(data, function (d) { return d.percent; })]);

    static_yScale
        .range([static_height, 0])
        .domain(data.map(function (d) { return d.misto; }));


    svg_static.select(".y-axis")
        .transition()
        .duration(0)
        .call(d3.axisLeft(static_yScale));
    //
    // svg_static.select(".x-axis")
    //     .transition()
    //     .duration(0)
    //     .call(d3.axisTop(static_xScale)
    //         .ticks(3)
    //         .tickSizeOuter(0)
    //         .tickFormat(d3.format(".2s"))
    //     );


    var static_bar = svg_static.selectAll(".static")
        .data(data);

    static_bar
        .attr("height", static_yScale.bandwidth() - 3)
        .attr("y", function (d) { return static_yScale(d.misto);  })
        .transition().duration(0)
        .attr("width", function (d) { return static_xScale(d.percent);  });

    static_bar.enter().append("rect")
        .attr("class", "static")
        .attr("fill", chartsMainColor)
        .attr("x", 0)
        .attr("y", function (d) { return static_yScale(d.misto); })
        .attr("height", static_yScale.bandwidth() - 3)
        .attr("width", function (d) { return static_xScale(d.percent);  });

    static_bar.exit().remove();



    var static_labels = svg_static
        .selectAll(".static_labels")
        .data(data);

    static_labels
        .transition().duration(duration)
        .attr("x", function (d) { return static_xScale(d.percent)+ 3; })
        .attr("y", function (d) { return static_yScale(d.misto) + static_yScale.bandwidth()/2; })
        .text(function(d){ return d.percent + "%"});


    static_labels.enter().append("text")
        .attr("class", "static_labels")
        .style("fill", "black")
        .attr("x", function (d) { return static_xScale(d.percent)+ 3; })
        .attr("y", function (d) { return static_yScale(d.misto) + static_yScale.bandwidth()/2; })
        .text(function(d){ return d.percent + "%"});

    static_labels.exit().remove();




    
}