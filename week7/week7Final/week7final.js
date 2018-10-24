var fs = require('fs');
var obj0 = JSON.parse(fs.readFileSync('output/d9.json', 'utf8')); //from michaels 
var obj1 = JSON.parse(fs.readFileSync('m09Address.json', 'utf8')); //from our json with the address and lat long 
var obj2 = [];

obj0.forEach (function(element, i) { 
    //console.log(element.address, i);
    //console.log(obj1[i].lat);
    //console.log(obj1);
    //console.log(element,i);
    
    
    obj2.push({ "oldAddress": element.address , "newAddress" : obj1[i].streetAddress, "lat" : obj1[i].lat, "long" : obj1[i].long, "adrmeta": element.adrmeta, "title": element.title, "wheelc": element.wheelc, "meetings": element.meetings, "details": element.details}); //add more key value pairs to this line 
    
    
});
// console.log(obj2);
//write that file out as a JSON file

fs.writeFileSync('combinedm09Address.json', JSON.stringify(obj2)); 