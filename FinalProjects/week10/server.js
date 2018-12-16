var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'candicejmchan';
db_credentials.host = 'candice-chan.czvxvpflre5e.us-east-2.rds.amazonaws.com'; //candice-chan.czvxvpflre5e.us-east-2.rds.amazonaws.com
db_credentials.database = 'candicechan';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID; 
AWS.config.secretAccessKey = process.env.AWS_KEY; 
AWS.config.region = "us-east-2"; 





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






// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query 
    // var thisQuery = 
    // `SELECT newAddress, title as location, lat, long, json_agg(json_build_object('day', day, 'time', startTime)) as meetings
    //              FROM candicechan 
                //  GROUP BY newAddress, title, lat, long
                //  ;`;
                 
                 //var thisQuery = "CREATE TABLE aalocations1 (oldAddress varchar(255),newAddress varchar(255),lat double precision, long double precision, title varchar(255), wheelc boolean, meetings integer, day varchar(100), startTime varchar(100), endTime varchar(100), meetingType varchar(50), details varchar(255));"

    // var thisQuery = "SELECT * from candicechan"
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







// respond to requests for /deardiary
app.get('/deardiary', function(req, res) {

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    
    // DynamoDB (NoSQL) query
    var params = {
        TableName: "deardiarynewest",
        KeyConditionExpression: "#dt = :dt", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            //"#tp": "topic"
              "#dt" : "date"
        },
        ExpressionAttributeValues: { // the query values
            // ":topicName": { S: "cats" }
             ":dt" : {S: "Fri Oct 19 2018"} 
        }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.send(data.Items);
            console.log('3) responded to request for dear diary data');
        }
    });

});

// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});
