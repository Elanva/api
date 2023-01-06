const express = require('express');
const router = express.Router();
const dbconfig = require('../dbconfig');
const connection = dbconfig.getConnection();

//Medicine CRUD Operations
router.get('/stockdetail', async (req, res, next) => {
    connection.query("SELECT medicine_id, medicine_name,medicine_type,in_stock_total,mfr,expiry_date,purchase_date,TIMESTAMPDIFF(day,now(3),expiry_date) AS expirydays from Medicine_Master", (err, results, fields) => {
      
        if (err) {
            res.sendStatus(500);
            return;
        }
        else if (results == 0) {
            res.json({ "Data": "Data not Found", "Status": "false" });
        }
        else {
            res.json({ "Data": results, "Status": "true" });
        }
   
    });
});
//get medicinedetail like price stock qty from Medicine_Master for Pharmacy bill
router.get('/medicinedetail/:id', async (req, res) => {
    const medicine_id = req.params.id;
    let sql = "SELECT medicine_id,mrp_rate,GST_percentage,in_stock_total from Medicine_Master where medicine_id = (?)";
    connection.query(sql, [medicine_id], (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else if (results == 0) {
            res.json({ "Data": "Data not Found", "Status": "false" });
        }
        else {
            res.json({ "Data": results[0], "Status": "true" });
        }
    });
});
//Medcine Types to Load in Picker control
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


//get medicine stock details

module.exports = router;