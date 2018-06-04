
const path = require("path");
const cheerio = require("cheerio");
const superagent = require("superagent");
const fs = require("fs");
const async = require('async');

const MongoDB = require("./mongodb");

// 数据库配置
const dbUrl = `mongodb://0.0.0.0:27017`;
const dbName = `meizi`;

const db = new MongoDB(dbUrl, dbName);


// page
const pageCount = 1;
const pageUrl = [];

for (let i = 1; i <= pageCount; i++) {
    if (i == 1) {
        pageUrl.push("https://www.cnblogs.com/cate/108703/");    
    } else {
        pageUrl.push("https://www.cnblogs.com/cate/108703/#p" + i);
    }
}


// 定时器
// 每
const day = 86400000;
const YMD = new Date().toLocaleDateString();
let lowTime = new Date(`${YMD} 00:00:00`).getTime();

setInterval(timeHandler, 1000);

function timeHandler() {
	let time = Date.now();

	if (time >= (lowTime + day)) {
		console.log(`日期：${YMD} cnblogs 获取数据...`);

		getPage2Url(pageUrl);

		lowTime = time;
	}
}

// getPage2Url(pageUrl);

// 获取页面的全部url
function getPage2Url(pageUrl) {
	let count = 1;

	async.mapLimit(pageUrl, 1, async (url) => {
		let linkList = [];
		
		let html = await getPageHtml(url);

		let $ = cheerio.load(html);
		
		// 获取指定内容
		$(".post_item_body").each((i, item) => {
			let data = {
				href: $(item).find(".titlelnk").attr("href"),
				title: $(item).find(".titlelnk").text(),
				desc: $(item).find(".post_item_summary").text().trim(),
				readCount: $(item).find(".article_view").text().replace(/[^0-9]*/g, ""),
				publishTime: $(item).find(".post_item_foot").contents().filter(function() {return this.nodeType === 3}).text().replace(/[\u4e00-\u9fa5]*/g, '').trim(),
				author: {
					name: $(item).find(".lightblue").text(),
					href: $(item).find(".lightblue").attr("href")
				}
			};

			linkList.push(data);
		});

		console.log(`第 ${count} 条请求完成.`);
		count++;

		writeDB(linkList);

		return linkList;

	}, (err, results) => {
		if (err) throw err;
	})
}

// 写入数据库
function writeDB(list) {

	list.forEach(item => {
		
		let href = {href: item.href};
		// 查表是否存在
		db.find("cnblogs", href, (err, result) => {
			if (err) throw err;
			
			// 不存在插入
			if (result.length < 1) {
				db.insert("cnblogs", item, (err, result) => {
					if (err) throw err;
					
				});
			} else {
				console.log(`有重复链接： ${item.title}`);
			}
		});

	});
	
}

// 发送请求
function getPageHtml(url) {
    return new Promise((resolve, reject) => {
		
		setTimeout(() => {
			superagent
				.get(url)
				.end((err, result) => {
					if (err) {
						return reject(err);
					};
					resolve(result.text);
				})
		}, 500);
        
    });
}

console.log(`get cnblogs info`);