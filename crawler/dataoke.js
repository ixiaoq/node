const http = require("http");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "http://www.dataoke.com/";
let result = [];

http.get(url, function (res) {
	console.log('statusCode:', res.statusCode);

	let html = "";

	res.on("data", function (data) {
		html += data;
	});

	res.on("end", function (data) {
		var $ = cheerio.load(html);
		$(".quan_goods").each((i, item) => {
			var tempData = {
				img: $(item).find(".lazy").attr("data-original"),
				w: $(item).find(".lazy").attr("width"),
				h: $(item).find(".lazy").attr("height"),
				title: $(item).find(".quan_title").text(),
				sell: $(item).find(".index_sell").find("span").text(),
				saleMoney: $(item).find(".quan_sale_money").text(),
				oldPrice: $(item).find(".quan_old_price").text().replace("￥", "")
			};
			//console.log(tempData);
			result.push(tempData);
		});

		console.log("请求完成");

		fs.writeFile("data.txt", JSON.stringify(result), (err) => {
			if(err) return console.log(err);
			console.log("写入成功");
		});
	});

}).on("error", (error) => {
	console.log(error);
});
