var margin_school = {top: 20, right: 60, bottom: 50, left: 70},
    width_school = d3.select("#fantom").node().getBoundingClientRect().width - margin_school.left - margin_school.right,
    height_school = 650 - margin_school.top - margin_school.bottom ;

// append the svg object to the body of the page
var svg_6 = d3.select("#chart_6")
    .attr("width", width_school + margin_school.left + margin_school.right)
    .attr("height", height_school + margin_school.top + margin_school.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin_school.left + "," + margin_school.top + ")");


var school_xScale = d3.scaleLinear();
var school_yScale = d3.scaleLinear();
var school_rScale = d3.scaleLinear();



//add axis
svg_6.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height_school + ")");


svg_6.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(-5," + 0 + ")");



//axis labels
svg_6.append("text")
    .attr("class", 'axis-labels')
    .attr("transform",
        "translate(" + (width_school/2) + " ," +
        (height_school + margin_school.bottom - 5) + ")")
    .style("text-anchor", "start")
    .text("сильні школи, 180+ у понад 15 випуск.");


svg_6.append("text")
    .attr("class", 'axis-labels')
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin_school.left)
    .attr("x",0 - (height_school / 2))
    .attr("dy", "1em")
    .style("text-anchor", "start")
    .text("слабкі школи, 180+ до 3 випуск.");


//points container
var points_wrapper = svg_6.append('g')
    .attr("class", "points-container");



function draw__school(df) {

    df.forEach(function(d){
        d.plus_180_percent = +d.plus_180_percent;
        d.GoodSchool = + d.GoodSchool;
        d.BadSchool = +d.BadSchool;
    });

    var new_width = d3.select("#fantom")
            .node()
            .getBoundingClientRect()
            .width - margin_school.left - margin_school.right;


    d3.select("#chart_6")
        .attr("width", new_width + margin_school.left + margin_school.right);



    //draw axis
    let xMax = d3.max(df, function(d){ return d.GoodSchool});
    let yMin= d3.min(df, function(d){ return d.BadSchool});
    let yMax= d3.max(df, function(d){ return d.BadSchool});


    school_xScale
        .domain([0, xMax+1])
        .range([ 0, new_width ]);

    school_yScale
        .domain([yMin-5, yMax+5])
        .range([height_school, 0]);

    svg_6.select(".x-axis")
        .transition()
        .duration(750)
        .call(d3.axisBottom(school_xScale)
            .ticks(6)
            .tickValues([5, 10, 15, 20])
            .tickSize(-height_school)
            .tickFormat(function(d) { return d + "%"})
        )
        .style('font-size', '14px');


    svg_6.select(".y-axis")
        .transition()
        .duration(750)
        .call(d3.axisLeft(school_yScale)
            .ticks(5)
            .tickValues([60, 70, 80, 90])
            .tickSize(-new_width)
            .tickFormat(function(d) { return d + "%"})
        )
        .style('font-size', '14px');


    //points radius
    let rMin = d3.min(df, function(d) { return d.Population });
    let rMax = d3.max(df, function(d) { return d.Population });

    school_rScale
        .domain([rMin, rMax])
        .range([5, 15]);





    // Add dots
    var points = points_wrapper
        .selectAll(".dot")
        .data(df);

    points
        .enter()
        .append("circle")
        .attr("class", "dot tip")
        .attr("fill", chartsMainColor)
        .style("opacity", 0.8)
        .attr("data-tippy-content", function(d){ return d.misto })
        .transition().duration(750)
        .attr("cx", function (d) { return school_xScale(d.GoodSchool); } )
        .attr("cy", function (d) { return school_yScale(d.BadSchool); } )
        .attr("r", function(d){ return school_rScale(d.Population)});


    points
        .transition().duration(750)
        .attr("cx", function (d) { return school_xScale(d.GoodSchool); } )
        .attr("cy", function (d) { return school_yScale(d.BadSchool); } )
        .attr("r", function(d){ return school_rScale(d.Population)});

    points.exit().remove();


    // Add labels
    var point_labels = points_wrapper
        .selectAll(".point_labels")
        .data(df);

    point_labels
        .enter()
        .append("text")
        .attr("class", "point_labels")
        .attr("fill", "grey")
        .attr("x", function (d) { return school_xScale(d.GoodSchool) + school_rScale(d.Population) }  )
        .attr("y", function (d) { return school_yScale(d.BadSchool) + school_rScale(d.Population)  } )

        .text(function(d) {
            if(["Мукачево", "Мелітополь", "Бердянськ", "Білгород-Дністровський", "Миколаїв", "Кропивницький",
                "Херсон", "Одеса","Ужгород","Черкаси", "Стрий", "Бердянськ", "Тернопіль", "Маріуполь", "Київ"].indexOf(d.misto) >= 0 ){
                return d.misto
            } else {
                return ""
            }
        });


    point_labels
        .transition().duration(750)
        .attr("x", function (d) { return school_xScale(d.GoodSchool) + school_rScale(d.Population) / 3}  )
        .attr("y", function (d) { return school_yScale(d.BadSchool) + school_rScale(d.Population) / 3 } )
        .text(function(d){
            if(["Мукачево", "Мелітополь", "Бердянськ", "Білгород-Дністровський", "Миколаїв", "Кропивницький",
                    "Херсон", "Одеса","Ужгород","Черкаси", "Стрий", "Бердянськ", "Тернопіль", "Маріуполь", "Київ"].indexOf(d.misto) >= 0 ){
                return d.misto
            } else {
                return ""
            }


        });

    point_labels.exit().remove();



    tippy('.dot', {
        // trigger: 'click',
        arrow: false,
        duration: 0   
    
    });





}
