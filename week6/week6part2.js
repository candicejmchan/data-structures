// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-2";

var dynamodb = new AWS.DynamoDB();

//you have to use your primary key as part of the query expression. There is no query you can make that doesnt include the use of your primary key
//query object. It is expecting an object with at least a key value pair of table name, keyconditionexpression, and   
var params = {
    TableName : "deardiarydate",
    
    'KeyConditionExpression': '#dt = :date AND #meal = :meal', // the query expression
  
    'ExpressionAttributeNames': { // name substitution, used for reserved words in DynamoDB
        "#dt" : 'date',
        "#meal" :'meal'  // if topic is offlimits it is refered with #tp (date, item )
        
    },
    
 
    'ExpressionAttributeValues': { // the query values
        ':date' : {S: 'Oct 02 2018'}, 
        ':meal': {S: 'breakfast'}
     
    }
};




dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});