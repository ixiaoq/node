/**
 * 1. { useNewUrlParser: true }
 *
 * 查找
 * findOne
 * find
 *
 * 插入
 * insertOne
 * insertMany
 *
 * 删除
 * deleteOne
 * deleteMany
 *
 * 更新
 * updateOne
 * updateMany
 *
 *
 */

const dbUrl = `mongodb://139.199.129.237:27017`;
const dbName = `meizi`;

const MongoClient = require("mongodb");
const assert = require("assert");


class MongoDB {
    constructor(dbUrl, dbName) {
        if (!dbUrl) throw dbUrl;
        if (!dbName) throw dbName;
    
        this.dbUrl = dbUrl;
        this.dbName = dbName;
        this.db = null;
    }
    
    // 连接
    connect () {
        MongoClient.connect(this.dbUrl, { useNewUrlParser: true }, (err, client) => {
            assert.equal(null, err);
            this.db = client;
        });
    }
    
    insert () {
    
    }
}

const db = new MongoDB(dbUrl, dbName);


// Use connect method to connect to the server
// MongoClient.connect(dbUrl, { useNewUrlParser: true }, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

//   console.log(db.createIndex.toString());
    
//     client.close();
//   // dbo.collection("test").deleteOne({name: "Google"}, (err, result) => {
//   //     assert.equal(null, err);

//   //     console.log(result);

//   //     client.close();
//   // });

//   //   client.close();
// });
