var AipFaceClient = require("baidu-aip-sdk").face;
var fs = require('fs');

// 设置APPID/AK/SK
var APP_ID = "10286643";
var API_KEY = "kzfL07Eg6kCqwdZpSzctGKqw";
var SECRET_KEY = "Fk3RRtON0aE8zbFTL9auGZUnXZApk5ai";

var client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);


var clientHandler = {
    data: "",
    init: (req, res) => {
        var body = req.body;
        body.img = clientHandler.base64Img(req.body.img);

        switch (req.body.type) {
            case "addUser":
                clientHandler.addUser(res, body);
                break;
            case "updateUser":
                clientHandler.updateUser(res, body);
                break;
            case "getUser":
                clientHandler.getUser(res, body);
                break;
            case "identifyUser":
                clientHandler.identifyUser(res, body);
                break;
            case "verifyUser":
                clientHandler.verifyUser(res, body);
                break;
            default:
                console.log("未知请求");
                break;
        }
    },

    base64Img: (img) => {
        var base64Img = img.replace(/data:image\/\w+;base64,/, "");
        return new Buffer(base64Img, "base64").toString("base64");
    },

    // 检测
    detect: (res, params) => {
        client.detect(params.img).then(function (result) {
            res.send(result);
        });
    },

    // 注册
    addUser: (res, params) => {
        var uid = params.uid;
        var userInfo = params.name; // 昵称
        var groupIds = ['txsj1'];

        client.addUser(uid, userInfo, groupIds, params.img).then(function (result) {
            if (!result.error_code) {
                res.send("注册成功!");
            } else {
                res.send(result);
            }
        });
    },

    // 更新
    updateUser: (res, params) => {
        var uid = params.uid;
        var userInfo = params.name; // 昵称
        var groupIds = ['txsj1'];

        client.updateUser(uid, userInfo, groupIds, params.img).then(function (result) {
            res.send(result);
        });
    },

    // 查询
    getUser: (res, params) => {
        var uid = params.uid;
        var groupId = 'txsj1';

        client.getUser(uid, {
            group_id: groupId
        }).then(function (result) {
            res.send(result);
        });
    },

    // 识别
    identifyUser: (res, params) => {
        var groupIds = ['txsj1'];

        client.identifyUser(groupIds, params.img).then(function (result) {
            res.send(result);
        });
    },

    // 认证
    verifyUser: (res, params) => {
        var uid = params.uid;
        var groupIds = ['txsj1'];

        client.verifyUser(uid, groupIds, params.img).then(function (result) {
            res.send(result);
        });
    }
};

// var image = fs.readFileSync('./src/img/01.jpg');
// console.log(image);
// var base64Img = new Buffer(image).toString('base64');

// client.detect(base64Img).then(function(result) {
//     console.log(JSON.stringify(result));
// });

module.exports = clientHandler;