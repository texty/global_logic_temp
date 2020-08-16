var margin_scatter = {top: 20, right: 20, bottom: 50, left: 60},
    width_scatter = d3.select("#fantom").node().getBoundingClientRect().width - margin_scatter.left - margin_scatter.right,
    height_scatter = 650 - margin_scatter.top - margin_scatter.bottom ;

// append the svg object to the body of the page
var svg_5 = d3.select("#chart_5")
    .attr("width", width_scatter + margin_scatter.left + margin_scatter.right)
    .attr("height", height_scatter + margin_scatter.top + margin_scatter.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin_scatter.left + "," + margin_scatter.top + ")");


var scatter_xScale = d3.scaleLinear();
var scatter_yScale = d3.scaleLinear();
var scatter_rScale = d3.scaleLinear();

svg_5.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height_scatter + ")");

svg_5.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(-5," + 0 + ")");

svg_5.append("text")
    .attr("class", 'axis-labels')
    .attr("transform",
        "translate(" + (width_scatter/2) + " ," +
        (height_scatter + margin_scatter.bottom - 5) + ")")
    .style("text-anchor", "start")
    .text("отримали 180+ на ЗНО з матеметики");


svg_5.append("text")
    .attr("class", 'axis-labels')
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin_scatter.left + 5)
    .attr("x",0 - (height_scatter / 2))
    .attr("dy", "1em")
    .style("text-anchor", "start")
    .text("IT ФОПи до загальної к-ті випускників");


var points_container = svg_5.append('g')
    .attr("class", "points-container");

function draw__scatter(df) {

    df.forEach(function(d){
        d.plus_180_percent = +d.plus_180_percent;
        d.FOP_percent = +d.FOP_percent;
        d.Population = +d.Population;
    });

    var new_width = d3.select("#fantom")
            .node()
            .getBoundingClientRect()
            .width - margin_scatter.left - margin_scatter.right;


    d3.select("#chart_5")
        .attr("width", new_width + margin_scatter.left + margin_scatter.right);


    let xMax = d3.max(df, function(d){ return d.plus_180_percent});
    let yMax= d3.max(df, function(d){ return d.FOP_percent});

    scatter_xScale
        .domain([1.5, xMax+1])
        .range([ 0, new_width ]);

    scatter_yScale
        .domain([0, yMax+0.2])
        .range([height_scatter, 0]);


    let rMin = d3.min(df, function(d) { return d.Population });
    let rMax = d3.max(df, function(d) { return d.Population });

    scatter_rScale
        .domain([rMin, rMax])
        .range([5, 15]);

    var dataLinear = [];

    df.forEach(function(d){
        let ob = { "x":d.plus_180_percent, "y": d.FOP_percent };
        dataLinear.push(ob)
    });

    let linearRegression = d3.regressionLinear()
            .x(function(d) { return d.x })
            .y(function(d) { return d.y })
            .domain([-1.7, 16]);

    let res = linearRegression(dataLinear);
    let line = d3.line()
            .x(function(d) { return scatter_xScale(d[0]) })
            .y(function(d) { return scatter_yScale(d[1]) });

    points_container
        .selectAll("path")
        .remove();

    var path = points_container
        .append("path")
        .datum(res)
        .attr("d", line)
        .style("stroke", chartsMainColor)
        .style("opacity", 0.5)
        .style("stroke-width", "1px");


    svg_5.select(".x-axis")
        .transition()
        .duration(750)
        .call(d3.axisBottom(scatter_xScale)
            .tickValues([2.5, 4, 5.5, 7])
            .tickSize(-height_school)
        )
        .style('font-size', '14px');


    svg_5.select(".y-axis")
        .transition()
        .duration(750)
        .call(d3.axisLeft(scatter_yScale)
            .ticks(5)
            .tickValues([0.5, 1, 1.5])
            .tickSize(-new_width)
        )
        .style('font-size', '14px');



    // Add dots
    var points = points_container
        .selectAll(".scatter_dot")
        .data(df);

    points
        .enter()
        .append("circle")
        .attr("class", "scatter_dot")
        .attr("fill", chartsMainColor)
        .style("opacity", 0.8)
        .transition().duration(750)
        .attr("cx", function (d) { return scatter_xScale(d.plus_180_percent); } )
        .attr("cy", function (d) { return scatter_yScale(d.FOP_percent); } )
        .attr("r", function(d){ return scatter_rScale(d.Population)})
        .attr("data-tippy-content", function(d){ return d.misto });
        

    points
        .transition().duration(750)
        .attr("cx", function (d) { return scatter_xScale(d.plus_180_percent); } )
        .attr("cy", function (d) { return scatter_yScale(d.FOP_percent); } )
        .attr("r", function(d){ return scatter_rScale(d.Population)})
        .attr("data-tippy-content", function(d){ return d.misto });
    
    points.exit().remove();






    // Add labels
    var point_labels = points_container
        .selectAll(".point_labels")
        .data(df);

    point_labels
        .enter()
        .append("text")
        .attr("class", "point_labels")
        .attr("fill", "grey")
        .attr("x", function (d) { return scatter_xScale(d.plus_180_percent)  + scatter_rScale(d.Population); })
        .attr("y", function (d) { return scatter_yScale(d.FOP_percent) + scatter_rScale(d.Population) })
        .text(function(d) {
            if(["Чернівці", "Житомир", "Харків", "Львів", "Київ",
                    "Черкаси", "Чернігів", "Луцьк", "Дніпро",
                    "Миколаїв", "Суми", "Рівне", "Запоріжжя"]
                    .indexOf(d.misto) >= 0 ){
                return d.misto
            } else {
                return ""
            }
        });


    point_labels
        .transition().duration(750)
        .attr("x", function (d) { return scatter_xScale(d.plus_180_percent)  + scatter_rScale(d.Population); })
        .attr("y", function (d) { return scatter_yScale(d.FOP_percent) + scatter_rScale(d.Population) })
        .text(function(d){
            if(["Чернівці", "Житомир", "Харків", "Львів", "Київ",
                    "Черкаси", "Чернігів", "Луцьк", "Дніпро",
                    "Миколаїв", "Суми", "Рівне", "Запоріжжя"]
                    .indexOf(d.misto) >= 0 ){
                return d.misto
            } else {
                return ""
            }


        });

    point_labels.exit().remove();


    //tippy
    tippy('.scatter_dot', {
        arrow: false,
        //trigger: 'click',
        //content: 'Global content',
        duration: 0,
        onShow(tip) {
            tip.setContent(tip.reference.getAttribute('data-tippy-content'))
        }

    });



}
