// if there are multiple tables, how do they relate to each other 
// communicate how to structure tables and store data 
//part 2: credentials - replace with mine, user name, host, database, password(stored in environment variable), port 
// This will allow access to the database I created on my own
// Var thisQuery = "Create table alocations (address varchar(100), lat doubule precision, long double precision);"; -- modify this 
//create data for just the data we have now 

const { Client } = require('pg');

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

// Sample SQL statement to create a table: 
var thisQuery = "CREATE TABLE aalocations (address varchar(100), lat double precision, long double precision);"; //var char is another way to say text 
// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE aalocations;"; 
// Sample SQL statement to query the entire contents of a table: 
// var thisQuery = "SELECT * FROM aalocations;";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});


