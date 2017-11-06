const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require('multer');
const clientHandler = require("./AipFaceClient");

const app = express();
const PORT = 6060; //端口

app.use(express.static(path.join(__dirname, "src")));

app.post('/file_upload', multer().array(), function (req, res) {
    clientHandler.init(req, res);
})

// 监听
var server = app.listen(PORT, function () {
    var port = server.address().port
    console.log("server runing port: %s", port)
})