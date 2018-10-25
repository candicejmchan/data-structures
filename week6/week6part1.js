const { Client } = require('pg');
const cTable = require('console.table');

// AWS RDS POSTGRESQL INSTANCE // 
var db_credentials = new Object();
db_credentials.user = 'candicejmchan';
db_credentials.host = 'candice-chan.czvxvpflre5e.us-east-2.rds.amazonaws.com';
db_credentials.database = 'candicechan';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to query meetings on Monday that start on or after 7:00pm: 
// var thisQuery = "SELECT mtgday, mtgtime, mtglocation, mtgaddress, mtgtypes FROM aadata WHERE mtgday = 'Monday' and mtghour >= 7;";

// var thisQuery = "SELECT count(*) FROM aadata;"; // shows you how many in the data 
// var thisQuery = "SELECT count(dinstinct mtgaddress) FROM aadata;"; // 
// var thisQuery = "SELECT distinct mtgaddress FROM aadata;"; // 


//what designates a point on a map and how do we want to group those individual meetings at that location. Return a query string that outputs the results that subset what we started 

//sure fire way to get hot output (select, from, where, group, having, order by)
//select has to come before from which has to come before where 

var thisQuery = "SELECT oldAddress, newAddress, lat, long FROM aalocations1 WHERE day = 'Mondays' AND startTime='1:00 PM';";

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});