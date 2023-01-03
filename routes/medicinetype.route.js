const express = require('express');
const router = express.Router();
const dbconfig = require('../dbconfig');
const connection = dbconfig.getConnection();

//Medicine CRUD Operations

// 1. Get All Medicine details
router.get('/', (req, res, next) => {
    connection.query("SELECT * FROM Medicine_Type", (err, results, fields) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else if (results == 0) {
            res.json({ "Data": "Data not Found", "Status": "false" })
        }
        else {
            res.json({ "Data": results, "Status": "true" })
        }

    });
})



module.exports = router;