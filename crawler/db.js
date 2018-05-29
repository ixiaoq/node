const mysql = require("mysql");

const pool = mysql.createPool({
  host    : `139.199.129.237`,
  user    : `users_db`,
  password: `users_db`,
  database: `users_123456`
});


let query = (sql, value) => {
    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {

                connection.query(sql, value, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {

                        resolve(rows);
                    }

                    connection.release();
                })
            }
        });
    });
};

module.exports = {
    query
};