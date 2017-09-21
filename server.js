var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');

app.get('/', function(req, res) {
 
  request('http://taobao.com', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(body);
      console.log(body);
      res.send(body);
    }
  })
});

var server = app.listen(5555, function() {
  console.log('listening at 5555');
});