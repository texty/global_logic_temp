/**
 * Created by yevheniia on 10.08.20.
 */

const parseDate = d3.timeParse("%Y-%m-%d");
var target_cx;


Promise.all([
    d3.csv("data/c_math.csv"),
    d3.csv("data/villageSize.csv"),
    d3.csv("data/changes.csv"),
    d3.csv("data/big_cities.csv"),
    d3.csv("data/bad_good_schools.csv")
]).then(function(input){
    
    input[0].forEach(function(d){
        d.path_math_percent = +d.path_math_percent;
        d.average_zno =  +d.average_zno;
        d.plus_160_percent = +d.plus_160_percent;
        d.plus_180_percent = +d.plus_180_percent;
        d.plus_160_percent =  d.plus_160_percent - d.plus_180_percent;
        d.path_math_percent = d.path_math_percent - d.plus_160_percent - d.plus_180_percent;
    });    


    draw__stacked(input[0], "plus_180_percent");
    draw__villageSize(input[1], "Village");
    draw__lineChart(input[2]);
    draw__scatter(input[3]);
    draw__school(input[4]);
    draw__static();

    d3.select("#chart_2_wrapper").selectAll(".sort").on("click", function(d){
        d3.selectAll("#chart_2_wrapper").selectAll(".sort").classed("active", false);
        d3.select(this).classed("active", true);
        let sortValue = d3.select(this).attr("value");
        draw__stacked(input[0], sortValue);
        if(sortValue === "average_zno"){
            d3.selectAll(".average-label").style("display", "block")
        } else {
            d3.selectAll(".average-label").style("display", "none")
        }
    });


    d3.select("#chart_4_wrapper").selectAll(".sort").on("click", function(d){
        d3.selectAll("#chart_4_wrapper").selectAll(".sort").classed("active", false);
        d3.select(this).classed("active", true);
        let sortValue = d3.select(this).attr("value");
        draw__villageSize(input[1], sortValue);
        let allGroups = d3.select('#chart_4').selectAll("g.group");
        allGroups.style("opacity", 0.5);
        d3.select('#chart_4').selectAll("g.group").each(function(d){
            let groupName = d3.select(this).attr("data");
            if(groupName === sortValue){
                d3.select(this).style("opacity", 1)
            }
        })
    });
  


    d3.select(window).on('resize', function() {
        draw__stacked(input[0], "plus_180_percent");
        draw__villageSize(input[1], "Village");
        draw__lineChart(input[2]);
        draw__scatter(input[3]);
        draw__school(input[4]);
        draw__static();
    });







});











