const https = require("https");
const path = require("path");
const cheerio = require("cheerio");
const superagent = require("superagent");
const fs = require("fs");
const async = require('async');

const { query } = require('./db');

// page
const pageCount = 2;
const pageUrl = [];

for (let i = 1; i <= pageCount; i++) {
    if (i == 1) {
        pageUrl.push("https://www.cnblogs.com/cate/108703/");    
    } else {
        pageUrl.push("https://www.cnblogs.com/cate/108703/#p" + i);
    }
}


//  定时器

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


// 获取页面的全部url
function getPage2Url(pageUrl) {
	let count = 1;

	async.mapLimit(pageUrl, 1, async (url) => {
		let linkList = [];
		
		let html = await getRequest(url);

		let $ = cheerio.load(html);
		
		// 获取指定内容
		$(".titlelnk").each((i, item) => {
			let data = {
				href: $(item).attr("href"),
				title: $(item).text()
			};

			linkList.push(data);
		});

		console.log(`第 ${count} 条请求完成.`);
		count++;

		return linkList;

	}, (err, results) => {
		if (err) throw err;
		
		writeFile(results);
	})
}

// 写入文件
function writeFile(results) {
	let data = {
		date: new Date().toLocaleString(),
		data: results
	};

	let jsonData = JSON.stringify(data);

	// 文件名称
	let fileName = new Date().toLocaleDateString();
	let dirPath = path.join(__dirname, `/file`);
	let filePath = path.join(dirPath, `/${fileName}.txt`);

	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath);
	}

	fs.writeFile(filePath, jsonData, async (err) => {
		if (err) throw err;

		let sql = `INSET INTO cnblogs set date=?, file_path=?`;

		await query(sql, [fileName, filePath]);
	})
}


// 发送请求
function getRequest(url) {
    return new Promise((resolve, reject) => {
		
		setTimeout(() => {
			https.get(url, function (res) {
				let html = "";
		  
				res.on("data", function (data) {
					html += data;
				});
		  
				res.on("end", function (data) {
					resolve(html);
				});
		  
			}).on("error", (error) => {
				reject(error);
			});
		}, 500);
        
    });
}

