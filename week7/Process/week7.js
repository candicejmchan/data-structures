// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');
// var m05Address = '';
var m05Address = [];

// load the thesis text file into a variable, `content`
var content = fs.readFileSync('../data/m05.txt'); // .. goes up the directory 'data structures', then back down to data, then m05

// load `content` into a cheerio object
var $ = cheerio.load(content);


//var meetingData =[]//his way to do it

// print (to the console) names of thesis students
$('td').each(function(i, elem) { // all the addresses were in td. So td is the element we are working with
    // console.log($(elem).attr('style')); //attr('style') prints out all the styles in the TD
    // console.log('***************'); //shows where the spaces are because this is in a loop 

    if ($(elem).attr('style') == 'border-bottom:1px solid #e3e3e3; width:260px') { //if the element style has the exact list on the right, print it out 
        console.log($(elem).html().split('<br>')[2].trim().split(',')[0]); //this is chaining, you can add as many methods as you like with a '.' Split is when you dont want the other data. 
        console.log("+++++++")
        console.log($(elem).find("h4").html())
        console.log("+++++++")

    }

    console.log('************') 

    if ($(elem).attr("style") == 'border-bottom:1px solid #e3e3e3;width:350px;') {
        console.log('************')
        console.log($(elem).html().split('<br>'))
        
        m05Address.push($(elem).html().split('<br>')[2].trim().split(',')[0].split('(Basement)')[0]); //his way to do it
    }

 

});

// write the addresses to a text file

// $('').each(function(i, elem) { // select the class project and class titles and for each, do somethignn

// fs.writeFileSync('m05Address.txt', m05Address);
fs.writeFileSync('m05Address.txt', JSON.stringify(m05Address));

//Notes
//anytime time there is a $,Cheerio is working. It makes selections within the work.
//JSON.stringify is takes the JSOn array and converts it to a string so that we can read the string and JSON.parse it back to an array
//JSON.parse converts string back to an array
