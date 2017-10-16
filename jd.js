const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://search.jd.com/Search?keyword=iphone&wq=iphone";

var options = {
    url: url,
    headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Cookie": "ipLoc-djd=1-72-2799-0; qrsc=3; __jdv=122270672|direct|-|none|-|1508136934635; __jda=122270672.15064914392181495203654.1506491439.1506651060.1508136935.3; __jdb=122270672.2.15064914392181495203654|3.1508136935; __jdc=122270672; rkv=V0300; xtest=156.cf6b6759; __jdu=15064914392181495203654; 3AB9D23F7A4B3C9B=2OLQ3SIDFY73SKPMLXNL2PJVIABIRWSF4MMKRT7373TG7ZHRKEJ5VV54HPEUDXXTTJ45D2CKR6I74K6AHLL2RHWPOQ",
        "Host": "search.jd.com",
        "Pragma": "no-cache",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.79 Safari/537.36"

        // "Server": "nginx",
        // "Date": "Mon, 16 Oct 2017 06:43:17 GMT",
        // "Content-Type": "text/html",
        // "Transfer-Encoding": "chunked",
        // "Connection": "close",
        // "Vary": "Accept-Encoding",
        // "Set-Cookie": "xtest=156.cf6b6759; expires=Wed, 15-Nov-2017 06:43:17 GMT; Max-Age=2592000; domain=search.jd.com",
        // "Content-Encoding": "gzip"
    }
};

request(url, function (error, response, body) {
    console.log('statusCode:', response.statusCode);
    if (!error && response.statusCode == 200) {
        fs.writeFile("jd.html", body, (err) => {
            if (err) return;
            console.log("ok");
        });
        
      }
    
})