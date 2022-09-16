const express = require('express')
const mysql = require('mysql');
const app = express();
const cors = require("cors");
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "spendtime"
});

/* --- Connect to DB --- */
pool.getConnection((err, connection) => {
    if (err) throw err; //not connected!
    console.log('Connected as ID ' + connection.threadId);
})

app.post("/add", async (req, res) => {
    const time = req.body.time;
    console.log("time::", time);

    /* -- Connect to DB -- */
    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected!
        console.log("Connected as ID " + connection.threadId);

        // user the connection
        connection.query(`INSERT INTO storetime (time) VALUES (${time})`, (err, rows) => {
            //when done with the connection, release it
            connection.release();

            if (!err) {
                res.json({
                    message: "Data Added"
                })
            } else {
                res.json({
                    message: "Data Not Added"
                })
            }
            console.log("rows::", rows);
            console.log("err::", err);
        });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))