const { Client } = require('pg');
var async = require('async');
var fs = require('fs');

// AWS RDS POSTGRESQL INSTANCE // 
var db_credentials = new Object();
db_credentials.user = 'candicejmchan';
db_credentials.host = 'candice-chan.czvxvpflre5e.us-east-2.rds.amazonaws.com';
db_credentials.database = 'candicechan';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// const client = new Client(db_credentials);
// client.connect();
// var thisQuery = "SELECT * FROM aalocations1;";

// client.query(thisQuery, (err, res) => {
//     console.log(err, res);
//     client.end();
// });

//var addressesForDb = [ { address: '63 Fifth Ave, New York, NY', latLong: { lat: 40.7353041, lng: -73.99413539999999 } }, { address: '16 E 16th St, New York, NY', latLong: { lat: 40.736765, lng: -73.9919024 } }, { address: '2 W 13th St, New York, NY', latLong: { lat: 40.7353297, lng: -73.99447889999999 } } ];

for(j=1; j<11;j++) {
    
    if(j<10){
    var addressesForDb = JSON.parse(fs.readFileSync('combinedm0'+j+'Address.json'));}
    else{
       var addressesForDb = JSON.parse(fs.readFileSync('combinedm'+j+'Address.json')); 
    }



//var addressesForDb = JSON.parse(fs.readFileSync('zone4locations.json'));
//var addressesForDb = JSON.parse(fs.readFileSync('combinedm0'+j+'Address.json'));



async.eachSeries(addressesForDb, function(value, callback) {
    
    for(i=0;i<value.meetings.length;i++){
        
    const client = new Client(db_credentials);
    client.connect();
    //var thisQuery = "INSERT INTO aalocations1 VALUES (E'" + value.Address + "', " + value.Lat + ", " + value.Long + ");";
    //var thisQuery = "SELECT * FROM aalocations1;";
    
// var thisQuery = "INSERT INTO aalocations1 VALUES (E" + value.oldAddress + "', " + value.newAddress + ", " + value.lat +  ", " + value.long +  ", " + value.title +  ", " + value.wheelc + ", " + value.meetings.length +  ", " + value.meetings[0][0] + ", " + value.meetings[0][1] + ", " + value.meetings[0][2] + ");";
        
        // var thisQuery = "INSERT INTO aalocations1 (oldAddress, newAddress, lat, long, title, wheelc, meetings, day, startTime,endTime) VALUES (value.oldAddress,value.newAddress,value.lat,value.long,value.title,value.wheelc,i,value.meetings[i][0],value.meetings[i][1]+,value.meetings[i][2]);";
        
        var thisQuery = "INSERT INTO aalocations1 VALUES ('"+ value.oldAddress + "', '" + value.newAddress+ "','" +value.lat+ "','" +value.long+ "','" +value.title+ "','" +value.wheelc+ "','" +value.meetings.length+ "','" +value.meetings[i][0]+ "','" +value.meetings[i][1]+ "', '" +value.meetings[i][2]+ "','" + value.details + "');";
    
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    }
    
    setTimeout(callback, 2000); 
   
}); 
}
