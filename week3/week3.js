//put all of this in the console
//printenv | grep NEW_VAR // prints the variable
//export TAMU_KEY= "type your API KEY here" 
//printenv | grep NEW_VAR
//npm install async
//node week3.js


//get the lattitude and longitude for the address
//eachSeries() - placing each lat long with the correct addresses and making sure we do not move on until it is done 

var request = require('request'); // npm install request 
var async = require('async'); // npm install async
var fs = require('fs');

var apiKey = process.env.TAMU_KEY;  // getting the TAMU_KEY we created above 

var meetingsData = [];
// var addresses = ["122 East 37th Street","30 East 35th Street","350 East 56th Street"];
var addresses = JSON.parse(fs.readFileSync('m05Address.txt')); //read the file system m05Address, parse it as JSON

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    //step of api from texas a&M site
    apiRequest += 'streetAddress=' + value.split(' ').join('%20'); // %20 is a space in the url. we are splitting this at the sapce and rejoining them with a %20
    //value in each series is wahtever the value of the array at the point in the series
    
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey; //the environment variable automatically changes this to the api 
    apiRequest += '&format=json&version=4.01';
    
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            var thisGeo = {};
            thisGeo.streetAdress = tamuGeo['InputAddress']['StreetAddress'];
            thisGeo.lat = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Latitude'];
            thisGeo.long = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Longitude'];
            console.log(thisGeo);
            meetingsData.push(thisGeo); 
        }
    });
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('first.json', JSON.stringify(meetingsData)); 
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ');
    console.log(meetingsData.length);
});
