/**
 * 1. { useNewUrlParser: true }
 *
 * 查找
 *   find
 *
 * 插入
 *   insertOne
 *   insertMany
 *
 * 删除
 *   deleteOne
 *   deleteMany
 *
 * 更新
 *   updateOne
 *   updateMany
 *
 * 排序
 *   sort
 *    - type: 1  升序
 *    - type: -1 降序
 * 
 * 分页
 *   limit
 * 
 * 跳过条数
 *   skip
 * 
 * 等于	        {<key>:<value>}
 * 小于	        {<key>:{$lt:<value>}}
 * 小于或等于   {<key>:{$lte:<value>}}
 * 大于         {<key>:{$gt:<value>}}
 * 大于或等于   {<key>:{$gte:<value>}}
 * 不等于       {<key>:{$ne:<value>}}
 */


const MongoClient = require("mongodb").MongoClient;

/**
 * 构造函数
 * 
 * @param {String} dbUrl  数据库地址
 * @param {String || Array} dbName  数据库名称
 */
class MongoDB {
    constructor(dbUrl, dbName) {
        if (!dbUrl) throw dbUrl;
        if (!dbName) throw dbName;

        this.dbUrl = dbUrl;
        this.dbName = dbName;
    }
    
    // 连接数据库
    connect () {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.dbUrl, { useNewUrlParser: true }, (err, client) => {
                console.log("Connected successfully to server ...");
                
                err ? reject(err) : resolve(client);
            });
        });
    }

    async getClient (table_Name) {
        let client = await this.connect();
        let db = client.db(this.dbName);
        db = db.collection(table_Name);
        
        return { client, db };
    }
    
    /**
     * 插入数据
     * 
     * @param {String} table_Name 表名称
     * @param {Object || Array} data 插入的数据
     * @param {Function} callback 回调方法
     * @memberof MongoDB
     */
    insert (table_Name, data, callback) {
        if (Array.isArray(data)) {
            this._insertMany(table_Name, data, callback);
        } else {
            this._insertOne(table_Name, data, callback);
        }
    }
    
    // 插入单条
    async _insertOne (table_Name, data, callback) {
        let { client, db } = await this.getClient(table_Name);
        
        db.insertOne(data, (err, result) => {
            this._resultHandler(err, result, callback);
            client.close();
        });
    }

    // 插入多条
    async _insertMany (table_Name, data, callback, length) {
        let { client, db } = await this.getClient(table_Name);

        db.insertMany(data, (err, result) => {
            this._resultHandler(err, result, callback);
            client.close();
        });
    }
    
    /**
     * 查询数据
     * 
     * @param {String} table_Name 表名称
     * @param {Object} data 查询数据
     * @param {Function} callback 回调方法
     * @memberof MongoDB
     */
    async find (table_Name, data, callback) {
        let { client, db } = await this.getClient(table_Name);

        if (typeof data === "function") {
            callback = data;
            data = {};
        }

        db.find(data).toArray((err, result) => {
            this._resultHandler(err, result, callback);

            client.close();
        });
    }
    
    /**
     * 分页查询数据
     * 
     * @param {String} table_Name 表名称
     * @param {Object} options 查询数据
     * @param {Function} callback 回调方法
     * @memberof MongoDB
     */
    async findPage (table_Name, {page = 1, limit = 20}, callback) {
        let { client, db } = await this.getClient(table_Name);

        // 第几个开始
        let skipS = (page - 1) * limit;

        db.find().skip(skipS).limit(limit).toArray((err, result) => {
            this._resultHandler(err, result, callback);

            client.close();
        });
    }
    
    /**
     * 查询排序
     * 
     * @param {String} table_Name 表名称
     * @param {Object} isSort 排序条件
     * @param {Function} callback 回调方法
     * @memberof MongoDB
     */
    async findSort (table_Name, isSort, callback) {
        let { client, db } = await this.getClient(table_Name);
        
        let mySort = {};
        for (let [key, value] of Object.entries(isSort)) {
             mySort[key] = value;
        }
        
        db.find().sort(mySort).toArray((err, result) => {
            this._resultHandler(err, result, callback);

            client.close();
        });
    }
    
    /**
     * 更新单条数据
     * 
     * @param {String} table_Name 表名
     * @param {Object} whereData 查找条件
     * @param {Object} updateDate 更新数据
     * @param {Function} callback 回调方法
     * @memberof MongoDB
     */
    async update (table_Name, whereData, updateDate, callback) {
        let { client, db } = await this.getClient(table_Name);

        db.updateOne(whereData, {$set: updateDate},(err, result) => {
            this._resultHandler(err, result, callback);

            client.close();
        });
    }
    
    /**
     * 更新多条数据
     * 
     * @param {String} table_Name 表名
     * @param {Object} whereData 查找条件
     * @param {Object} updateDate 更新数据
     * @param {Function} callback 回调方法
     * @memberof MongoDB
     */
    async updateMany (table_Name, whereData, updateDate, callback) {
        let { client, db } = await this.getClient(table_Name);

        db.updateMany(whereData, {$set: updateDate},(err, result) => {
            this._resultHandler(err, result, callback);

            client.close();
        });
    }

    /**
     * 删除单条数据
     * 
     * @param {String} table_Name 表名
     * @param {Object} data 删除条件
     * @param {Function} callback 回调方法
     * @memberof MongoDB
     */
    async delete (table_Name, data, callback) {
        let { client, db } = await this.getClient(table_Name);

        db.deleteOne(data, (err, result) => {
            this._resultHandler(err, result, callback);

            client.close();
        });
    }

    /**
     * 删除多条数据
     * 
     * @param {String} table_Name 表名
     * @param {Object} data 删除条件
     * @param {Function} callback 回调方法
     * @memberof MongoDB
     */
    async deleteMany (table_Name, data, callback) {
        let { client, db } = await this.getClient(table_Name);
        
        db.deleteMany(data, (err, result) => {
            this._resultHandler(err, result, callback);

            client.close();
        });
    }

    _resultHandler (err, result, callback) {
        if (err) {
            callback && callback(err);
        } else {
            callback && callback(err, result);
        }
    }
}

module.exports = MongoDB;