const request = require('request');
var parseString = require('xml2js').parseString;

request('http://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnld=109', function (error, response, body) {
    // console.log('body:', body); // Print the HTML for the Google homepage.
  
  // # work3 xml2js example
  parseString(body, function (err, result) {
    console.dir(result.rss.channel);
  });

  // # work4 wf forecast info print
  parseString(body, function (err, result) {
    console.dir(result.rss.channel[0].item[0].description[0].header[0].wf);
  });
});