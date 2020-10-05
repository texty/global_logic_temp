const duration = 750;
var red = "#FD8B7B";
const stacked_margin = {top: 10, right: 30, bottom: 50, left: 150},
    stacked_width =  d3.select("#fantom").node().getBoundingClientRect().width - stacked_margin.left - stacked_margin.right,
    stacked_height = 700 - stacked_margin.top - stacked_margin.bottom;


const svg_2 = d3.select("#chart_2")
    .attr("class", "svg-wrapper")
    .attr("width", stacked_width + stacked_margin.left + stacked_margin.right)
    .attr("height", stacked_height + stacked_margin.top + stacked_margin.bottom)
    .append("g")
    .attr("transform", "translate(" + stacked_margin.left + "," + stacked_margin.top + ")");

var stacked_xScale = d3
    .scaleLinear();


var zno_xScale = d3.scaleLinear()
    .domain([100, 200]);


var stacked_yScale = d3
    .scaleBand()
    .paddingInner(0.25);


svg_2
    .append("g")
    .attr("class", "zno-axis");

//Add group for the x axis
svg_2
    .append("g")
    .attr("class", "x-axis");

//Add group for the y axis
svg_2.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");


svg_2.append("text")
    .attr("class", 'axis-labels')
    .attr("transform",
        "translate(" + (stacked_width/2) + " ," +
        (stacked_height + stacked_margin.bottom - 5) + ")")
    .style("text-anchor", "start")
    .text("cклали ЗНО з математики");


// svg_2.append("text")
//     .attr("class", 'axis-labels')
//     .attr("transform",
//         "translate(" + (stacked_width/2) + " ," +
//         (-40) + ")")
//     .style("text-anchor", "start")
//     .text("cередній бал ЗНО з математики")
//     .style("fill", red);


var stacked_color = d3
    .scaleOrdinal()
    .domain(["plus_180_percent", "plus_160_percent", "path_math_difference"])
    .range(['#C0C750', "#FFD65E", "#E1DDDD"]);




function draw__stacked(df, sort){



    var keys;
    if(sort != "average_zno"){

        var key_arr = ["plus_180_percent", "plus_160_percent", "path_math_difference" ];

        for( var i = 0; i < key_arr.length; i++){
            if ( key_arr[i] === sort) {
                key_arr.splice(i, 1);
            }
        }


        keys = [sort].concat(key_arr);
    } else {
        keys = ["plus_180_percent", "plus_160_percent", "path_math_difference" ];
    }


    var data;
    if(sort ===  "path_math_difference"){
        data = df.sort(function(a, b) {
            return a["path_math_percent"] - b["path_math_percent"];
        });
    } else {
        data = df.sort(function(a, b) {
            return a[sort] - b[sort];
        });
    }






    //var keys =
    var layers = d3.stack().keys(keys)(data);
    
    var new_width = d3.select("#fantom").node().getBoundingClientRect().width  - stacked_margin.left - stacked_margin.right;
    var new_height = 700 - stacked_margin.top - stacked_margin.bottom;

    d3.select("#chart_2")
        .attr("width", new_width + stacked_margin.left + stacked_margin.right)
        .attr("height", new_height + stacked_margin.top + stacked_margin.bottom);


    zno_xScale
        .range([0,  new_width]);

    stacked_xScale
        .rangeRound([0,  new_width])
        .domain([0, 100]);

    stacked_yScale
        .rangeRound([new_height, 0])
        .domain(df.map(function(d) {
            return d.oblast_ua;
        }));


    svg_2.select(".y-axis")
        .transition()
        .duration(duration)
        .call(d3.axisLeft(stacked_yScale))
        .style('font-size', '13px');


    // svg_2.select(".zno-axis")
    //     .transition()
    //     .duration(0)
    //     .attr("transform", "translate(0," + 0 + ")")
    //     .call(d3.axisTop(zno_xScale)
    //         .ticks(5)
    //     )
    //     .style('font-family', 'inherit')
    //     .style('color', red);

    svg_2.select(".x-axis")
        .transition()
        .duration(0)
        .attr("transform", "translate(0," + new_height + ")")
        .call(d3.axisBottom(stacked_xScale)
            .ticks(5)
            .tickFormat(function(d) { return d + "%"})
        );


    var group = svg_2.selectAll("g.layer")
        .data(layers);


    group
        .transition().duration(duration)
        .attr("fill", function (d) {
            return stacked_color(d.key)
    });

    group.enter()
        .append("g")
        .classed("layer", true)
        .attr("fill", function (d) {
            return stacked_color(d.key)
        })
        .attr("group", function (d) { return d.key });

    group.exit().remove();


    var bars = svg_2.selectAll("g.layer")
        .selectAll("rect")
        .data(function (d) { return d; });

    bars
        .transition().duration(duration)
        .attr("width", function (d) { return stacked_xScale(d[1]) - stacked_xScale(d[0]) })
        .attr("height", stacked_yScale.bandwidth())
        .attr("y", function (d) { return stacked_yScale(d.data.oblast_ua); })
        .attr("x", function (d) { return stacked_xScale(d[0]); });


    bars.enter()
        .append("rect")        
        .attr("width", function (d) {
            return stacked_xScale(d[1]) - stacked_xScale(d[0]) })
        .attr("y", function (d) {  return stacked_yScale(d.data.oblast_ua); })
        .attr("x", function (d) { return stacked_xScale(d[0]); })
        .attr("height", stacked_yScale.bandwidth());

    bars.exit().remove();




    var plans = svg_2.selectAll(".plans")
        .data(layers[0]);

    plans.exit().remove();

    plans.enter()
        .append("rect")
        .attr("class", "plans tip")
        .attr("stroke", "none")
        .attr("fill", red)
        .attr("width", 1 )
        .attr("y", function (d) {  return stacked_yScale(d.data.oblast_ua); })
        .attr("x", function (d) {  return zno_xScale(d.data.average_zno) })
        .attr("height", stacked_yScale.bandwidth())
        .merge(plans)
        .attr("y", function (d) { return stacked_yScale(d.data.oblast_ua); })
        .attr("x", function (d) {  return zno_xScale(d.data.average_zno) })
        .attr("height", stacked_yScale.bandwidth())
        .style("opacity", 0)
        .transition().duration(duration)
        .attr("width", 1)
        .style("opacity", 1);


    var text = svg_2.selectAll(".average-label")
        .data(layers[0]);

    text.exit().remove();

    text.enter()
        .append("text")
        .attr("class", "average-label")
        .attr("y", function (d) {  return stacked_yScale(d.data.oblast_ua) + stacked_yScale.bandwidth() - 3 ; })
        .attr("x", function (d) {  return zno_xScale(d.data.average_zno)  + 5 })
        .attr("fill", red)
        .text(function(d){ return d.data.average_zno})
        .merge(text)
        //.style("display", "none")
        .transition().duration(duration)
        .attr("y", function (d) {  return stacked_yScale(d.data.oblast_ua) + stacked_yScale.bandwidth() - 3 ; })
        .attr("x", function (d) {  return zno_xScale(d.data.average_zno)  + 5 } )
        .text(function(d){ return d.data.average_zno})


}