let $datepicker;

const svgWidth = document.querySelector('#chart').clientWidth;// 800;
const svgHeight = document.querySelector('#chart').clientHeight; //500
const margin = {
    top: 20,
    left: 40,
    right: 40,
    bottom: 150
};


const width = svgWidth - margin.top - margin.bottom;
const height = svgHeight - margin.left - margin.right;
const radius = 150;

//Tooltip when you hover over the dots on the circle. Delays the tooltip
const tooltipTransition = d3.transition()
    .duration(750)
    .ease(d3.easeLinear);

//colours corresponding to each circle, legend, and bars on the interface
const color = {
    sweet: '#F594E1',
    sour: '#DF9F1D',
    bitter: '#4E2807',
    spicy: '#D01353',
    salty: '#607EC8'
};

//angles on which the dots are placed on the circle to represent the time of day I eat
const mealAngles = {
    breakfast: 9,
    lunch: 1,
    dinner: 7
};

let dayWiseData, currentDay, chart;

//initialize the svg with the width, height, and margins
const svg = d3.select('#chart')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

//x-scale
const x = d3.scaleLinear()
    .range([0, width / 2 - margin.right]);

//y-scale
const y = d3.scaleBand()
    .padding(0.4)
    .range([height * 0.4 , 0]);

//maps the time to the angles (0-11)
const rscale = d3.scaleOrdinal()
    .domain(d3.range(0, 12))
    .range(d3.range(0, 360, 30));

//use to pick the date in the calendar which changes the content of the dots
const setDatePicker = (minDate, maxDate, currentDay) => {
    $datepicker = $('#datepicker').datepicker({
        uiLibrary: 'bootstrap4',
        minDate: minDate,
        maxDate: maxDate,
        value: currentDay,
        format: 'mm/dd/yyyy',
        change: function (e) {
            const value = new Date($datepicker.value());
            drawCircleChart(dayWiseData, value);
            placement();
        }
    });
}

//fetch the data from the server
d3.json('/getDiaryData')
.then(res => {

    //converting all string dates to date objects
    dayWiseData = res.dayWiseData.map(k => {
        k.date = new Date(k.date);
        return k;
    });

    //default current day when the chart starts
    currentDay = dayWiseData[1].date;

    //current date for the date picker
    const currentDate = `${currentDay.getMonth() + 1}/${currentDay.getDate()}/${currentDay.getFullYear()}`;

    //initialize the date picker
    setDatePicker(
        dayWiseData[0].date,
        dayWiseData[dayWiseData.length - 1].date,
        currentDate
    );

    //creating summary chart and legend and clockchart
    createSummaryChart(res.summary);
    createLegend(res.summary);
    clockChart(dayWiseData, currentDay);
    placement();
});

//creates the summary chart
const createSummaryChart = (summary) => {
    x.domain([0, d3.max(summary, d => d.count)]);
    y.domain(summary.map(d => d.taste));

    const xshift = 20;

    const tasteChart = svg.append('g').attr('class', 'taste-chart');

    tasteChart.append('text')
        .attr('x', -10)
        .attr('class', 'taste-chart-title')
        .text('Monthly Meals Summary');


    const tasteBarGroup = tasteChart.selectAll('g')
        .data(summary).enter()
        .append('g')
        .attr('class', 'taste-bar')
        .attr('transform', d => `translate(0, ${y(d.taste)})`);

    tasteBarGroup.append('rect')
        .attr('x', xshift)
        .attr('height', y.bandwidth())
        .attr('width', d => x(d.count))
        .style('fill', d => color[d.taste]);

    tasteBarGroup.append('circle')
        .attr('r', y.bandwidth() / 2)
        .attr('cx', d => x(d.count) + xshift)
        .attr('cy', y.bandwidth() / 2)
        .style('fill', d => color[d.taste]);

    tasteBarGroup.append('text').attr('class', 'count')
        .attr('x', d => x(d.count) + xshift)
        .attr('y', 0.75 * y.bandwidth())
        .style('fill', '#fff')
        .style('text-anchor', 'middle')
        .text(d => d.count);

    tasteBarGroup.append('text').attr('class', 'taste')
        .attr('x', 0)
        .attr('y', 0.75 * y.bandwidth())
        .style('fill', '#fff')
        .style('text-anchor', 'middle')
        .text(d => d.taste);
};

const createLegend = (summary) => {
    const legend = svg.append('g').attr('class', 'legend');

    const legendGroup = legend.selectAll('g')
        .data(summary).enter()
        .append('g')
        .attr('class', 'taste-bar')
        .attr('transform', (d, i) => `translate(0, ${y(d.taste)})`);

    legendGroup.append('circle')
        .attr('r', y.bandwidth() / 2)
        .attr('cx', 30)
        .attr('cy', y.bandwidth() / 2)
        .style('fill', d => color[d.taste]);

    legendGroup.append('text').attr('class', 'taste')
        .attr('x', 0)
        .attr('y', 0.75 * y.bandwidth())
        .style('fill', '#fff')
        .style('text-anchor', 'middle')
        .text(d => d.taste);
};

//clock chart places a group called circle chart
const clockChart = (source, currentDay) => {
    chart = svg.append('g').attr('class', 'circle-chart');
    drawCircleChart(source, currentDay);
}

//draw the chart
const drawCircleChart = (source, currentDay) => {
    const data = source.filter(d => d.date.toDateString() === currentDay.toDateString())[0];

    chart.select('.clock-base').remove();

    chart.append('circle').attr('class', 'clock-base')
        .attr('r', radius)
        .attr('cx', 0)
        .attr('cy', 0);

    const mealData = chart.selectAll('.meal')
            .data(data.meals, d => d.meal + d.taste);

    mealData.exit().remove();

    const meal = mealData.enter()
        .append('g').attr('class', 'meal')
        .attr('transform', `translate(0, 0)`);

    //when you go over the dot the tooltip with the meal informtion shows up
    meal.on('mouseover', d => {
       const x = d3.event.clientX;
       const y = d3.event.clientY;

       d3.selectAll('#tooltip')
        .transition(tooltipTransition)
        .style('top', y + 'px')
        .style('left', x + 'px')
        .style('display', 'block');

       d3.selectAll('#tooltip')
            .html(d.items.join(', '));

    });

    //when you are move away from the circle the meal content will not appear
    meal.on('mouseout', d => {
        d3.selectAll('#tooltip')
        .transition(tooltipTransition)
        .style('display', 'none');
    });

    meal.append('circle')
        .attr('r', 10)
        .attr('cx', d => {
            const angleDeg = rscale(mealAngles[d.meal]);
            console.log(angleDeg);
            const angleRad = angleDeg * Math.PI / 180;
            const xval = radius * Math.sin(angleRad);//Math.cos(angleDeg);
            return xval;
        })
        .attr('cy', d => {
            const angleDeg = rscale(mealAngles[d.meal]);
            const angleRad = angleDeg * Math.PI / 180;
            const yval = -radius * Math.cos(angleRad);//Math.sin(angleDeg);
            return yval;
        })
        .style('fill', d => color[d.taste]);
}

//placing the three components onto their respective placement on the canvas
const placement = () => {
    svg.select('.legend')
        .attr('transform', `translate(${width * 0.9 + margin.right}, 0)`);

    svg.select('.taste-chart')
        .attr('transform', `translate(${width * 0.3}, ${height * 0.7})`);

    svg.select('.circle-chart')
        .attr('transform', `translate(${width * 0.5}, ${height * 0.3})`);
};
