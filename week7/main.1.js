// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

var data;

// days 
function getDays (elem) {
	var e = Object.assign({}, elem);
	$(e).find('h4,br,div,span,img').remove();  // remove non-day elements
	var text = $(e).text().match(/[SMTWF]\w+?days/g);
	return text;
}

// timesx2 
function getTimes (elem) {
	var e = Object.assign({}, elem);
	$(e).find('h4,br,div,span,img').remove();  // remove non-day elements
	var text = $(e).text().match(/\d\d?:\d\d [A|P]M/g);
	// console.log(text);
	return text;
}

// details-box 
function getWchair (elem) {
	e = $(elem).text();
	return e.includes('Wheelchair');
}

// details-box 
function getTitle (elem) {
	e = $(elem).find('h4');
	var text = $(e).text();
	return text;
}

// details-box 
function getDetails (elem) {
	e = $(elem).find('div');
	var text = $(e).text();
	return text.replace(/[(\t\n]+/g, '').replace(/ +/g, " ").trim(); // get rid of cruft
}

//meeting type
function getMType (elem) {
	var e = Object.assign({}, elem);
	$(e).find('h4,b,div,span,img').remove();  // remove non-address elements
	var text = $(e).text().match(/ [BCSTOD][BDp ]/g); //.trim();

	if (text != null) {
		var lines = [];
		text.forEach(function (d) {
			lines.push(d.trim());
			});
		// console.log(lines);
	  return lines;
	} else 
	  return null;
}

// address & address meta info
function getAddress (elem) {
	var e = Object.assign({}, elem);
	$(e).find('h4,b,br,div,span,img').remove();  // remove non-address elements
	var text = $(e).text().match(/\n\t+?[1-9][\w\W]+,/g)
	if (text != null) {
		var lines = [];
		text[0].split(',').slice(0,-1).forEach(function(d, i) {
			var line = d;
			line = line.replace(/ Ave[\w\W]+/, ' Ave.'); // Greedy match Avenue
			line = line.replace(/ St[\w\W]+| ST[\w\W]+/, ' St.'); // Greedy match Street
			line = line.replace(/[()\t\n]+/g, '').replace(/ +/g, " ").trim(); // get rid of cruft
			lines.push(line);
			});
	  // console.log(lines);
	  if (lines.length > 20) // lines of crud
	    return null;
	  else
		  return lines;
	} else 
	  return null;
}

// (5) 230 East 60th Street (Basement)
// (4) BLUEPRINT FOR LIVING no h4
// subtitle
// special interest
// go through all rows

function parseData () {
	$('tr').each(function(i, elem) {
		d = {};
		var adr = getAddress(elem);
		// console.log(adr);
		var ttl = getTitle(elem);
		var wch = getWchair(elem);
		var day = getDays(elem);
		//console.log(day)
		var tim = getTimes(elem);
		var det = getDetails(elem);
		var mty = getMType(elem);
		//console.log(mty);
		// mty = [1,2,3,4,5,6,7,7,8,8,7,6,6];
		
		if (adr != null) {
			d['address'] = adr[0];
			if (adr.length > 1)
				d['adrMeta'] = adr.slice(1);
			meetInfo = [];  
			day.forEach((d,i) => {
				meetInfo.push([d, tim[i*2], tim[i*2+1], mty[i]]);
				});
			d['title'] = ttl;	
			d['wheelc'] = wch;
			d['meetings'] = meetInfo;
			d['details'] = det;
			data.push(d);
		}
	});
}

// console.log(JSON.stringify(data));

// look for td element with unique style attribute
//~ $('td[style="border-bottom:1px solid #e3e3e3; width:260px"]').each(function(i, elem) {
	//~ // Get day
	//~ day = $(elem).text().match(/[SMTWF][a-z]+day/g);
	//~ console.log(day);
	//~ $(elem).find('h4,b,br,div,span,img').remove();  // remove non-address elements
	//~ // del tabs/nl, del multiple spaces, del padding spaces
	//~ var text = $(elem).text().replace(/[\t\n]+/g, '').replace(/ +/g, " ").trim();
	//~ console.log (text);
	//~ // String cleanup.  
	//~ text = text.replace(/ Ave[\w\W]+/, ' Ave.'); // Greedy match Avenue
	//~ text = text.replace(/ St[\w\W]+| ST[\w\W]+/, ' St.'); // Greedy match Street

	//~ data.push({'location':text});
    //~ // console.log("'" + text + "'");
//~ });

for (var i = 1; i <= 10; i++) {
	var content;
	if (i < 10)
		content += fs.readFileSync(`data/m0${i}.txt`);
	else
		content += fs.readFileSync(`data/m${i}.txt`);
	
	}
	
	var $ = cheerio.load(content);
	
	data = [];  // structure I will fill
	
	parseData();
	
fs.writeFileSync(`outputLatLong.json`, JSON.stringify(data));
