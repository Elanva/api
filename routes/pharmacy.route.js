const express = require('express');
const router = express.Router();
const dbconfig = require('../dbconfig');
const connection = dbconfig.getConnection();

//Medicine CRUD Operations

//Pharrmacy CRUD Operations 
//Get Pharrmacy Details by Patient Id
router.get('/patientlist/', (req, res, next) => {
    const Patient_Id = req.params.id;
  
    connection.query("SELECT p.prescrip_second_id,p.Patient_Id,p.medicine_id,p.medicine_name,p.medicine_type,p.no_of_days,p.quantity,p.befre_or_aftr_food,p.morning,p.afternoon,p.night,m.medicine_name from Prescription_Details p, Medicine_Master m Where p.medicine_id=m.medicine_id and Patient_Id= ?",Patient_Id,(err, results, fields) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else if (results == 0) {
            res.json({ "Data": "Data Not Found", "Status": "false" })
        }
        else {
            res.json({ "Data": results, "Status": "true" })
        }

    });
})
//single dataset from Pharrmacy details
router.get('/getsinglePrescriptionById/:id', (req, res, next) => {
    connection.query("select p.prescription_id,p.Patient_Id,p.medicine_id,p.medicine_type,p.no_of_days,p.quantity,p.befre_or_aftr_food,p.morning,p.afternoon,p.evening,m.medicine_name from Prescription_Details p, Medicine_Master m Where Patient_Id= ? and p.medicine_id=m.medicine_id", (err, results, fields) => {
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

// get medicine name by Id
/*router.get('/:id', async (req, res, next) => {
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
});*/

//3.Add Doctors details
router.post('/addprescriptionPrimary', async (req, res) => {
    const data = req.body;
    connection.query('INSERT INTO Prescription_Primary SET ?', data, (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else {
            res.json({ "Data": "Record " + results.insertId + " Inserted", "Status": "true" });
        }
    })

});
router.post('/addprescriptionSecondary', async (req, res) => {
    const data = req.body;
    connection.query('INSERT INTO Prescription_Details SET ?', data, (err, results) => {
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
    const prscription_id = req.params.id;
    const data = [req.body.medicine_id,req.body.medicine_name, req.body.medicine_type,req.body.no_of_days, req.body.quantity, req.body.befre_or_aftr_food,req.body.morning, req.body.afternoon,req.body.night,req.body.Patient_Id, prscription_id];
    connection.query('UPDATE Prescription_Details SET medicine_id = ?, medicine_name = ?, medicine_type = ?,no_of_days=?, quantity=?, befre_or_aftr_food=?, morning=?, afternoon=?, night=?, Patient_Id=? WHERE prescrip_second_id =? ', data, (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else {
            res.json({ "Data": "Record Updated Successfully", "Status": "true" });
        }
    })

});
//5. Delete Prescrption by Id
router.delete('/delete/:id', (req, res, next) => {
  const prescription_id = req.params.id;
  connection.query('DELETE FROM Prescription_Details WHERE prescrip_second_id = ?',prescription_id
  ,(err,results)=>{
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