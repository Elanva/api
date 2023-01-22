const express = require('express');
const router = express.Router();
const dbconfig = require('../dbconfig');
const connection = dbconfig.getConnection();

//Medicine CRUD Operations

// 1. Get All Medicine details
router.get('/', (req, res, next) => {
    connection.query("SELECT * FROM Medicine_Master", (err, results, fields) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else if (results == 0) {
            res.json({ "Data": results, "Status": "false" })
        }
        else {
            res.json({ "Data": results, "Status": "true" })
        }

    });
})
router.get('/medicinename', (req, res, next) => {
    connection.query("SELECT medicine_id,medicine_name,mrp_rate,ptr_rate,single_qty_price,GST_percentage,expiry_date,medicine_type,hsn_code,qty,in_stock_total from Medicine_Master", (err, results, fields) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else if (results == 0) {
            res.json({ "Data": results, "Status": "false" })
        }
        else {
            res.json({ "Data": results, "Status": "true" })
        }

    });
})

//Sarrch Medcne by name
router.get('/search', async (req, res, next) => {
    const medicine_name = req.query.name;
    let sql = `CALL MedicineSearch(?)`;
    connection.query(sql, [medicine_name], (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else if (results == 0) {
            res.json({ "Data": "Data not Found", "Status": "false" })
        }
        else {
            res.json({ "Data": results[0], "Status": "true" })
        }

    });
})

// get medicine name by Id
router.get('/:id', async (req, res, next) => {
    const medicine_id = req.params.id;
    let sql = "SELECT * FROM Medicine_Master where medicine_id = (?)";
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

//3.Add Doctors details
router.post('/create', async (req, res) => {
    const data = req.body;
    connection.query('INSERT INTO Medicine_Master SET ?', data, (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else {
            res.json({ "Data": "Record " + results.insertId + " Inserted", "Status": "true" });
        }
    })

});

// 4. Update Medcne Detail
router.put('/update/:id', async (req, res) => {
    const medicine_id = req.params.id;
    const data = [req.body.medicine_name, req.body.medicine_type,req.body.mfr, req.body.hsn_code,req.body.qty,req.body.Free_qty,req.body.batch_no,req.body.expiry_date,req.body.mrp_rate,req.body.ptr_rate,req.body.GST_percentage,req.body.amount,req.body.single_qty_price,req.body.purchase_date,req.body.in_stock_total,medicine_id];
    connection.query('UPDATE Medicine_Master SET medicine_name = ?, medicine_type = ?,mfr = ?, hsn_code=?,qty=?,Free_qty=?,batch_no=?,expiry_date=?,mrp_rate=?,ptr_rate=?,GST_percentage=?,amount=?,single_qty_price=?,purchase_date=?,in_stock_total=? WHERE medicine_id =? ', data, (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else {
            res.json({ "Data": "Record Updated Successfully", "Status": "true" });
        }
    })

});
//5. Delete Doctor by Id
router.delete('/delete/:id', (req, res, next) => {
  const medicine_id = req.params.id;
  connection.query('DELETE FROM Medicine_Master WHERE medicine_id = ?',medicine_id,(err,results)=>{
      if(err){
          throw err;
      }
      else if(results.affectedRows == 0){
        res.json({ "Data": "Record not found", "Status": "false" });
      }
      else if(results.affectedRows == 1){
        res.json({ "Data": "Record Deleted Successfully", "Status": "true" });
      }
               
    
  })
})
//----------------


module.exports = router;