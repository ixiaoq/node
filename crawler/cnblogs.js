const https = require("https");
const cheerio = require("cheerio");
const superagent = require("superagent");
const fs = require("fs");

const url = "https://www.cnblogs.com/#p2";
const allUrl = [];


var pageUrls = ["https://www.cnblogs.com"],
    pageNum = 200;

for(var i=2; i<=pageNum; i++) {
    pageUrls.push("https://www.cnblogs.com/#p" + i);
}

pageUrls.forEach((url, i) => {

    https.get(url, function (res) {
        console.log('statusCode:', res.statusCode);
    
        let html = "";
    
        res.on("data", function (data) {
            html += data;
        });
    
        res.on("end", function (data) {
            var $ = cheerio.load(html);
            $(".titlelnk").each((i, item) => {
                allUrl.push($(item).attr("href"));
            });

            console.log(i + "请求完成");
    
            // fs.writeFile("data.txt", JSON.stringify(result), (err) => {
            // 	if(err) return console.log(err);
            // 	console.log("写入成功");
            // });
        });
    
    }).on("error", (error) => {
        console.log(error);
    });
    
});

console.log(allUrl);
