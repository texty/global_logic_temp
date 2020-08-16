/**
 * Created by yevheniia on 12.08.20.
 */
const villageSize_margin = {top: 40, right: 10, bottom: 50, left: 110},
    villageSize_width = d3.select("#fantom").node().getBoundingClientRect().width  - stacked_margin.left - stacked_margin.right,
    villageSize_height = 700 - villageSize_margin.top - villageSize_margin.bottom;


const real_ticks = ["Village", "City1", "City2", "City3", "BigCity"];
const desire_ticks = ["до 20", "100", "500", "1000", "1000+"];


const svg_4 = d3.select("#chart_4")
    .attr("class", "svg-wrapper")
    .attr("height", villageSize_height + villageSize_margin.top + villageSize_margin.bottom)
    .append("g")
    .attr("transform", "translate(" + villageSize_margin.left + "," + villageSize_margin.top + ")");


var villageSize_x1 = d3.scaleBand().padding([0.1]);
var villageSize_x2 = d3.scaleLinear();
var villageSize_yScale = d3.scaleBand();


//Add group for the x axis
svg_4
    .append("g")
    .attr("class", "x-axis");
    

//Add group for the y axis
svg_4.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");


var villageSize_color = d3
    .scaleLinear()
    .domain([0, 1, 3, 4, 5, 6.6])
    .range(['#FD8B7B', "#feaea3", "#FFD65E", '#ffe28e', '#d3d885', '#C0C750']);

svg_4.append("text")
    .attr("class", 'axis-labels')
    .attr("transform",
        "translate(" + (villageSize_width/2) + " ," +
        (villageSize_height + 20) + ")")
    .style("text-anchor", "start")
    .text("Відсоток випускників, що склали ЗНО на 180+");



function draw__villageSize(df, sort){

    var long_format = [];

    df.forEach(function(row){
        ["Village", "City1", "City2", "City3", "BigCity"].forEach(function(column){
            let ob = {"oblast_ua":row.oblast_ua, "cityType": column, "value": +row[column] };
            long_format.push(ob)
        });
    });

    var y_domain = df.sort(function(a,b) { return b[sort] - a[sort]}).map(function(d) {
        return d.oblast_ua;
    });

    var new_width = d3.select("#fantom").node().getBoundingClientRect().width  - stacked_margin.left - stacked_margin.right;
    var new_height = 700 - villageSize_margin.top - villageSize_margin.bottom;

    d3.select("#chart_4")
        .attr("width", new_width + villageSize_margin.left + villageSize_margin.right)
        .attr("height", new_height + stacked_margin.top);

    villageSize_x1
        .range([0, new_width])
        .domain(["Village", "City1", "City2", "City3", "BigCity"]);


    var xAxis = d3.axisTop(villageSize_x1)
        .ticks(3)
        .tickFormat(function(d){
            let ind = real_ticks.indexOf(d);
            return desire_ticks[ind]
        });

    villageSize_x2
        .domain([0, 7])
        .range([0, villageSize_x1.bandwidth()]);

    villageSize_yScale
        .rangeRound([0, new_height])
        .domain(y_domain)
        .paddingInner(0.25);


    svg_4.select(".y-axis")
        .transition()
        .duration(duration)
        .call(d3.axisLeft(villageSize_yScale)
            .tickSize(0)
        )
        .style('font-size', '13px');


    
    var data = d3.nest()
        .key(function(d){ return d.cityType})
        .entries(long_format);


    var group = svg_4.selectAll("g.group")
        .data(data);

    group.exit().remove();

    group
        .attr("transform", function(d){
            return `translate(${villageSize_x1(d.key)}, 0)`
    });

    group.enter()
        .append("g")
        .attr("class", "group")
        .attr("data", function(d){ return d.key })
        .attr("transform", function(d){
            return `translate(${villageSize_x1(d.key)}, 0)`
        })
        .style("opacity", function(d){
            return d.key === "Village"? 1 : 0.5
        });


    var bars = svg_4.selectAll("g.group")
        .selectAll("rect")
        .data(function (d) {
            return d.values;
        });

    bars
        .transition().duration(duration)
        .attr("x", function (k) {
            return villageSize_x2(0)}
        )
        .attr("y", function (k) { return villageSize_yScale(k.oblast_ua);  })
        .attr("width", function (k) {
            return villageSize_x2(k.value)}
        )
        .style("fill", function(k){
            return villageSize_color(k.value)
        })
        .attr("height", villageSize_yScale.bandwidth);


    bars.enter().append("rect")
        .attr("class", "circle")
        .style("fill", function(k){
            return villageSize_color(k.value)
        })
        .style("opacity", 0,8)
        .attr("x", function (k) {
            return villageSize_x2(0)}
        )
        .attr("y", function (k) { return villageSize_yScale(k.oblast_ua);  })
        .attr("width", function (k) {
            return villageSize_x2(k.value)}
        )
        .attr("height", villageSize_yScale.bandwidth);


    bars.exit().remove();


    var labels = svg_4.selectAll("g.group")
        .selectAll(".label")
        .data(function (d) {
            return d.values;
        });

    labels
        .transition().duration(duration)
        .attr("x", function (k) { return villageSize_x2(k.value) + 5 })
        .attr("y", function (k) { return villageSize_yScale(k.oblast_ua) + villageSize_yScale.bandwidth()/1.5;  })
        .text(function(k){ return k.value > 0 ?  k.value + "%" : ""})
        ;


    labels.enter().append("text")
        .attr("class", "label")
        .style("fill", "black")
       
        .attr("x", function (k) { return villageSize_x2(k.value) + 5 })
        .attr("y", function (k) { return villageSize_yScale(k.oblast_ua) + villageSize_yScale.bandwidth()/1.5;  })
        .text(function(k){ return k.value > 0 ?  k.value + "%" : "" });


    labels.exit().remove();

}