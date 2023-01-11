const express = require('express');
const router = express.Router();
const dbconfig = require('../dbconfig');
const connection = dbconfig.getConnection();

//Medicine CRUD Operations

//Pharrmacy CRUD Operations 
//Get Pharmacy Details by Patient Id
router.get('/patientlist/', (req, res, next) => {
      connection.query("select First_Name,Patient_Id,Doctor_Id,Phone_No, Status from Patients_Master where Status='Waiting For Pharmacy'",(err, results, fields) => {
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
//Sarch name in Pharmacy List
router.get('/patientlistbyid', async (req, res, next) => {
    const First_Name = req.query.name;
    let sql = `CALL PharmacylistSearch(?)`;
    connection.query(sql, [First_Name], (err, results) => {
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

// get Prescrription Detail by Patient Id
router.get('/getprescriptionbyid/:id', async (req, res, next) => {
    const patient_id = req.params.id;
    let sql = "select Prescription_Details.Patient_Id,Prescription_Details.medicine_id,Prescription_Details.medicine_name,Prescription_Details.medicine_type,Prescription_Details.no_of_days,Prescription_Details.quantity,Prescription_Details.befre_or_aftr_food,Medicine_Master.single_qty_price,Medicine_Master.in_stock_total from Prescription_Details INNER JOIN Medicine_Master ON Prescription_Details.medicine_id=Medicine_Master.medicine_id where Prescription_Details.Patient_Id = (?)";
    connection.query(sql, [patient_id], (err, results) => {
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