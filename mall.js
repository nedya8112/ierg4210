const sqlite3 = require('sqlite3').verbose();

let sql;

//connect to DB
const db = new sqlite3.Database('./mall.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

// //create table :
// sql = `CREATE TABLE categories (cid INTEGER PRIMARY KEY, name TEXT, image TEXT)`;
// db.run(sql);

// sql = `CREATE TABLE products (pid INTEGER PRIMARY KEY, cid INTEGER, name TEXT, price REAL, description TEXT, quantity INTEGER, image TEXT, FOREIGN KEY(cid) REFERENCES categories(cid) ON DELETE RESTRICT)`;
// db.run(sql);

sql = `CREATE TABLE users (uid INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, isAdmin BOOLEAN NOT NULL DEFAULT 0)`;
db.run(sql);

// Create an index for catid (to make subsequent queries by catid faster)
// sql = `CREATE INDEX i1 ON products(cid)`;
// db.run(sql);

// sql = `SELECT * FROM products`;
// db.all(sql, [], (err, rows) => {
//     if (err) return console.error(err.message);
//     rows.forEach((row) => {
//         console.log(row);
//     });
// });
