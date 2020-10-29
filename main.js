
import AreaChart from './js/AreaChart.js';
import StackedAreaChart from './js/StackedAreaChart.js';

let dataset;

d3.csv('unemployment.csv', d3.autoType)
    .then(data => {
        // compute total for each datapoint
        data.forEach(d => {
            let sum = 0;
            for(let prop in d) {
                if(prop !== "date") {
                    sum += d[prop];
                }
                
            }
            d.total = sum;
        });
        
        createVis(data);
    });

function createVis(data) {
    // update dataset
    dataset = data;

    let areaChart = AreaChart(".chart");
    areaChart.update(dataset);

    areaChart.on("brushed", (range) => {
        stackedAreaChart.filterByDate(range);
    });

    let stackedAreaChart = StackedAreaChart(".chart");
    stackedAreaChart.update(dataset);

}

