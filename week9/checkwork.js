const { Client } = require('pg');
const cTable = require('console.table');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'candicejmchan';
db_credentials.host = 'candice-chan.czvxvpflre5e.us-east-2.rds.amazonaws.com';
db_credentials.database = 'candicechan';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statements for checking your work: 

// Sample SQL statement to create a table: 
var thisQuery = "SELECT * FROM sensorData;";
var secondQuery = "SELECT COUNT (*) FROM sensorData;";
var thirdQuery = "SELECT sensorValue, COUNT (*) FROM sensorData GROUP BY sensorValue;";
var fourthQuery = `SELECT EXTRACT(DAY FROM sensorTime) as sensorday,
                    count(*) as num_obs
                    FROM sensorData
                    GROUP BY sensorday
                    ORDER BY sensorday;`;
var fifthQuery = `SELECT EXTRACT(DAY FROM sensorTime) as sensorday,
                    avg(sensorValue::int) as num_obs
                    FROM sensorData
                    GROUP BY sensorday
                    ORDER BY sensorday;`;
                    

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
    console.table(res.rows);
    }
});

client.query(secondQuery, (err, res) => {
    if (err) {throw err}
    else {
    console.table(res.rows);
    }
});

client.query(thirdQuery, (err, res) => {
    if (err) {throw err}
    else {
    console.table(res.rows);
    }
    client.end();
});

