var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone'); // moment-timezone --save

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'candicejmchan';
db_credentials.host = 'candice-chan.czvxvpflre5e.us-east-2.rds.amazonaws.com'; //candice-chan.czvxvpflre5e.us-east-2.rds.amazonaws.com
db_credentials.database = 'candicechan';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

app.get('/', (req, res) => {
   res.render('index')
});


// respond to requests for /sensor
app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query 
    var q = `SELECT EXTRACT(DAY FROM sensorTime) as sensorday,
             AVG(sensorValue::int) as num_obs
             FROM sensorData
             GROUP BY sensorday
             ORDER BY sensorday;`;


    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('1) responded to request for sensor data');
        }
    });
});

var s1x = `<!DOCTYPE html>
<meta charset="utf-8">
<!-- Adapted from: http://bl.ocks.org/Caged/6476579 -->
<style>
body {
  font: 12px sans-serif;
}

#chart {
    float: left;
    display: inline-block;
}

#sidebar {
    float: right;
    display: inline-block;
    width: 300px;
    font-size: 20px;
    padding-top: 50px;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}
.bar {
  fill: #addd8e;
}
.bar:hover {
  fill: #3182bd ;
}
.x.axis path {
  display: none;
}
.d3-tip {
  line-height: 1;
  font-weight: bold;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
}
/* Creates a small triangle extender for the tooltip */
.d3-tip:after {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  width: 100%;
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  position: absolute;
  text-align: center;
}
/* Style northward tooltips differently */
.d3-tip.n:after {
  margin: -1px 0 0 0;
  top: 100%;
  left: 0;
}
.selected-day {
    fill: #3182bd;
}
</style>
<body>
<div id="chart"></div>
<div id="sidebar">
    <p>Estimates of garbage thrown out for selected sensor day</p>
    <div></div>
</div>
<script src="https://d3js.org/d3.v3.min.js"></script>
<script src="https://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
<script>
var data = `;

var s2x = `; 
console.log(data);
const selectedColumn = 'tilted';
var margin = {top: 80, right: 20, bottom: 30, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var formatPercent = d3.format(".0%");
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);
var y = d3.scale.linear()
    .range([height, 0]);
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat( d => {
        if(selectedColumn === 'tilted') {
            return d;
        } else {
            return formatPercent(d);
        }
    });
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<p><strong>Opened:</strong> <span style='color:#3182bd'>" + d.tilted + "</span></p><p><strong>Average:</strong> <span style='color:#3182bd'>" + formatPercent(d.average) + "</span></p>";
  })
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg.call(tip);
  x.domain(data.map(function(d) { return d.sensorday; }));
  y.domain([0, d3.max(data, function(d) { return d[selectedColumn]; })]);
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text( d => {
        if(selectedColumn === 'tilted') {
            return 'Tilted Count';
        } else {
            return 'Percentage';
        }
      });
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.sensorday); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d[selectedColumn]); })
      .attr("height", function(d) { return height - y(d[selectedColumn]); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .on('click', function(d) {
          const data = {
              day: d.sensorday,
              num_obs: +d.tilted,
              average: formatPercent(d.average),
              week: 7 * +d.tilted,
              month: 30 * +d.tilted,
              year: 365 * +d.tilted
          };
          const html = [
                '<p><b>Sensor Day: </b><span>'+data.day+'</span></p>',
                '<p><b>Day: </b><span>'+data.num_obs+'</span></p>',
                '<p><b>Week: </b><span>'+data.week+'</span></p>',
                '<p><b>Month: </b><span>'+data.month+'</span></p>',
                '<p><b>Year: </b><span>'+data.year+'</span></p>',
                '<p><b>Percentage of Tilted vs. Closed: </b><span>'+data.average+'</span></p>',
          ];
          d3.select('#sidebar div').html(html.join(''));
          d3.selectAll('.bar').classed('selected-day', false);
          d3.select(this).classed('selected-day', true);
      });
</script>`;

const parseSensorData = (data) => {
  return  _.chain(data)
        .groupBy('sensorday')
        .toPairs()
        .map(d => {
            const temp = {
                sensorday: +d[0],
                total_obs: _.reduce(d[1], (sum, k) => sum + +k.num_obs, 0)
               
            };
            
            const tilted = _.filter(d[1], k => +k.value === 1)[0];
            temp.tilted = tilted ? +tilted.num_obs : 0;
            
            const closed = _.filter(d[1], k => +k.value === 0)[0];
            temp.closed = closed ? +closed.num_obs : 0;            

            temp.average = temp.tilted / temp.total_obs;
            return temp;
        })
        .value();
};

app.get('/ss', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    //              
    // SQL query 
    var qt = `SELECT EXTRACT(DAY FROM sensorTime) as sensorday,
             sensorValue::int AS value,
             COUNT(sensorValue::int) AS num_obs
             FROM sensorData
             GROUP BY sensorday, sensorValue
             ORDER BY sensorday;`;
    

    client.connect();
    client.query(qt, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            const data = parseSensorData(qres.rows);
            var resp = s1x + JSON.stringify(data) + s2x; 
            res.send(resp);
            client.end();
            console.log('1) responded to request for sensor graph');
        }
    });
});

// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query 
   var thisQuery = `
        SELECT newAddress AS address,
               title as location,
               lat,
               long,
               json_agg(
                   json_build_object(
                       'day', day,
                       'startTime', startTime,
                       'endTime', endTime,
                       'wheelc', wheelc,
                       'meetingtype', meetingtype,
                       'details', details
                    )
                ) as meetings
        FROM candicechan
        GROUP BY newAddress, title, lat, long
    `;

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

const filterDiaryData = (source) => {
    const data = _.chain(source)
    .filter(d => {
       return ['breakfast', 'lunch', 'dinner'].indexOf(d.meal['S']) !== -1; 
    })
    .map(d => {
        return {
            meal: d.meal.S,
            date: new Date(d.date.S),
            items: d.narrative.S.split(/,/).map(k => k.toLowerCase().trim()),
            taste: d.taste.S
        };
    })
    .sortBy(d => d.date)
    .value();
    
    const dayWiseData = _.chain(data)
        .groupBy('date')
        .toPairs()
        .map(d => {
            return {
                date: d[0],
                meals: d[1]
            };
        })
        .value();
    
    const summary = _.chain(data)
        .groupBy('taste')
        .toPairs()
        .map(d => {
            return {
                taste: d[0],
                count: d[1].length
            }
        })
        .value();
        
    return {
        data: data,
        summary: summary,
        dayWiseData: dayWiseData
    }
};

// respond to requests for /deardiary
app.get('/getDiaryData', function(req, res) {
    
   // AWS DynamoDB credentials
AWS.config = new AWS.Config(); 
AWS.config.accessKeyId = process.env.AWS_ID; 
AWS.config.secretAccessKey = process.env.AWS_KEY; 
AWS.config.region = "us-east-2"; 


    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    
     // DynamoDB (NoSQL) query
    var params = {
        TableName: "deardiarynewest"
    };

    dynamodb.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.json(filterDiaryData(data.Items));
            console.log('3) responded to request for dear diary data');
        }
    });
});

app.get('/deardiary', function(req, res) {
    res.render('diary');
});

// create templates
var hx = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AA Meetings</title>
  <meta name="description" content="Meetings of AA in Manhattan">
  <meta name="author" content="AA">
          <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
   integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
   crossorigin=""/>
   <style>
        #mapid {
            height: 800px;
            width: 55%;
            float: left;
            display: inline-block;
        }
        #sidebar {
            //background:#DAF7A6;
            height: 760px;
            width: 45%;
            display: inline-block;
            float: right;
        }  
        table {
            padding:10px;
            border-spacing:15px;
            font-size:13px;
            font-family:lato;
            text-align:left;
            color:black;
        }
   </style>
</head>
<body>
<div id="mapid"></div>
<div id="sidebar"></div>
  <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"
   integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
   crossorigin=""></script>
  <script>
  var data = 
  `;
  
const aaOutput = (d) => {
    
    const meetings = d.meetings.map(k => {
        return `
            <tr>
                <td>${k.day}</td>
                <td>${k.startTime}</td>
                <td>${k.endTime}</td>
                <td>${k.meetingType}</td>
                <td>${k.wheelc}</td>
                <td>${k.details}</td>
            </tr>
        `;
    });
    
    return `
        <section>
        <h2>AA Meeting Locations</h2>
        <table class="table table-striped">
            <thead>
                <tr><th></th><th></th></tr>
            </thead>
            <tbody>
                <tr><td>Location</td><td><b>${d.location}</b></td></tr>
                <tr><td>Address</td><td><b>${d.address}</b></td></tr>
            </tbody>
        </table>
        <hr>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Day</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Meeting Type</th>
                    <th>Wheelchair Access</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                ${meetings.join('')}
            </tbody>
        </table>
        </section>
    `;
};
  
var jx = `;
    console.log(data);
    var mymap = L.map('mapid').setView([40.734636,-73.994997], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        // accessToken: 'your.mapbox.access.token'
        accessToken: 'pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF0aDV2MjIyOTNsbWxlb2hhMmR4dCJ9.JJdYD_jWgRwUeJkDWiBz3w'
    }).addTo(mymap);
    for (var i=0; i<data.length; i++) {
        const marker = L.marker( [data[i].lat, data[i].lon] );
                // .bindPopup(JSON.stringify(data[i].meetings)).addTo(mymap);
        marker.properties = { data: data[i]};
        marker.on('click', (d) => {
                    console.log(d);
                    const output = JSON.stringify(
                        d.target.properties.data.meetings,
                        null, 4
                    );
                    
                    document.querySelector('#sidebar').innerHTML = d.target.properties.data.output;
                });
        marker.addTo(mymap);
    }
    </script>
    </body>
    </html>`;

// respond to requests for /aameetings
app.get('/aa', function(req, res) {

    var now = moment.tz(Date.now(), "America/New_York"); 
    var dayy = now.day().toString(); 
    var hourr = now.hour().toString(); 

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
   // var thisQuery = "SELECT * from candicechan"
    var thisQuery = `
        SELECT newAddress AS address,
               title as location,
               lat,
               long as lon,
               json_agg(
                   json_build_object(
                       'day', day,
                       'startTime', startTime,
                       'endTime', endTime,
                       'wheelc', wheelc,
                       'meetingType', meetingtype,
                       'details', details
                    )
                ) as meetings
        FROM candicechan
        GROUP BY newAddress, title, lat, lon
    `;

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        
        else {
            
            const rows = qres.rows.map(k => {
                k.output = aaOutput(k);
                return k;
            });
            
            var resp = hx + JSON.stringify(rows) + jx;
            res.send(resp);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// serve static files in /public
app.use(express.static('public'));

//listen on port 8080
app.listen(8080,function() {
    console.log('Server listening...');
});

