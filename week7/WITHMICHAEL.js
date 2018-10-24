var fs = require('fs');
var obj0 = JSON.parse(fs.readFileSync('output/d1.json', 'utf8')); //from michaels 
var obj1 = JSON.parse(fs.readFileSync('m01Address.json', 'utf8')); //from our json with the address and lat long 
var obj2 = [];

obj0.forEach (function(element, i) { 
    console.log(element.address, i);
    console.log(obj1[i].lat);
    
    
    obj2.push({"old address": element.address , "new address" : obj1[i].streetAddress, "lat" : obj1[i].lat, "long" : obj1[i].long }); //add more key value pairs to this line 
    
    
});
// console.log(obj2);
//write that file out as a JSON file

fs.writeFileSync('combinedm01Address.json', JSON.stringify(obj2)); 