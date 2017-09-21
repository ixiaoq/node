const http = require("https");
const cheerio = require("cheerio");

const url = "https://search.jd.com/Search?keyword=iphone&wq=iphone";

http.get(url, function(res){
  res.on("data", function(data){
    console.log("data" + data);
  });
  res.on("end", function(data){
    console.log("end" + data);
  });
});