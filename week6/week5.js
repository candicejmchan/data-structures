var diaryEntries = []; 
var async = require('async');

class DiaryEntry { //put the things you want to include 

  constructor(date, taste, meal, narrative) {
    // this.pk = {};
    // this.pk.S = primaryKey.toString(); //number primary key
    this.dt = {}; 
    this.dt.S = new Date(date).toDateString(); //string
    this.meal ={}; 
    this.meal.S = meal; 
    this.taste ={};
    this.taste.S= taste;
    this.narrative ={};
    this.narrative.S =narrative;
    }
  }
  
//come up with some data points that represent your idea 
diaryEntries.push(new DiaryEntry('October 10, 2018', 'breakfast', 'bitter', 'This food reminds me of'));
diaryEntries.push(new DiaryEntry('October 11, 2018', 'lunch', 'sour', 'I wonder what cuisine this is'));
diaryEntries.push(new DiaryEntry('October 12, 2018', 'dinner', 'sweet', 'I want to make this recipie soon!'));
diaryEntries.push(new DiaryEntry('October 13, 2018', 'breafast', 'salt', 'I have never tasted anything this yummy before')); // for nosql, the numbers do not make sense

console.log(diaryEntries); //console.log(JSON.stringify(diaryEntries));


//part 3
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID; 
AWS.config.secretAccessKey = process.env.AWS_KEY 
AWS.config.region = "us-east-2"; //put my credentials here 

var dynamodb = new AWS.DynamoDB();

async.eachSeries(diaryEntries,function(value,callback) {
  var params = {};
  params.Item =value;
  params.TableName = "deardiarydate";
  
})
// var params = {};
// params.Item = diaryEntries[0]; //this just goes over 1, but you can loop so that you can put multiple items in the table
// params.TableName = "deardiary";

async.eachSeries(diaryEntries, function(value, callback) {
var params ={};
params.Item = value; //this just goes over 1, but you can loop so that you can put multiple items in the table
params.TableName = "deardiarydate";

dynamodb.putItem(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

 setTimeout(callback, 2000); 
});