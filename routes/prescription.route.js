const express = require('express');
const router = express.Router();
const dbconfig = require('../dbconfig');
const connection = dbconfig.getConnection();

//Medicine CRUD Operations

//Prescription CRUD Operations 
//set status true or 1 to check whether prescripton Prmary data Saved or not
router.get('/Prescription_Primary/:id', (req, res, next) => {
    const Patient_Id = req.params.id;
    connection.query("select setstatus from Prescription_Primary Where Patient_Id= ?", Patient_Id,(err, results, fields) => {
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
//set status true or 1 to check whether prescripton Prmary data Saved or not
router.get('/PrescriptionPrimarystatus/:id', (req, res, next) => {
    const Patient_Id = req.params.id;
    connection.query("select setstatus,doctor_fees from Prescription_Primary Where Patient_Id= ?", Patient_Id,(err, results, fields) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else if (results == 0) {
            res.json({ "Data": results, "Status": "false" })
        }
        else {
            res.json({ "Data": results[0], "Status": "true" })
        }

    });
})

//Update status "Waiting For Pharmacy" in Patients_Master Table once prescription added
//need to work on prescription screen
router.put('/updatestatus/:id', async (req, res) => {
    const patient_id = req.params.id;
    connection.query('update Patients_Master set Status="Waiting For Pharmacy" WHERE Patient_Id = ? AND Status = "Waiting For Doctor"', patient_id, (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else {
            res.json({ "Data": "Record Updated Successfully", "Status": "true" });
        }
    })

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
router.put('/updatemedicinestatus/:id', async (req, res) => {
    const patientid = req.params.id;
    const medicineid = req.query.medicineid;
   // const data = [req.body.medicine_id,req.body.medicine_name, req.body.medicine_type,req.body.no_of_days, req.body.quantity, req.body.befre_or_aftr_food,req.body.morning, req.body.afternoon,req.body.night,req.body.Patient_Id, prscription_id];
    connection.query('UPDATE Prescription_Details SET status = "1" WHERE Prescription_Details.Patient_Id = ? and Prescription_Details.medicine_id = ?',[ patientid,medicineid],(err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else {
            res.json({ "Data": "Record Updated Successfully", "Status": "true" });
        }
    })

});
router.put('/medicinestatus/:id', async (req, res) => {
    const patientid = req.params.id;
    
   // const data = [req.body.medicine_id,req.body.medicine_name, req.body.medicine_type,req.body.no_of_days, req.body.quantity, req.body.befre_or_aftr_food,req.body.morning, req.body.afternoon,req.body.night,req.body.Patient_Id, prscription_id];
    connection.query('UPDATE Prescription_Details,Patients_Master,Prescription_Primary SET Prescription_Details.status = 1, Patients_Master.Status = "Done",Prescription_Primary.status="Done" WHERE Prescription_Details.Patient_Id =? and Patients_Master.Patient_Id =? and Prescription_Primary.Patient_Id=? and Patients_Master.Status = "Waiting For Pharmacy"and Prescription_Primary.status = "Waiting For Pharmacy"',[patientid,patientid,patientid],(err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else {
            res.json({ "Data": "Record Updated Successfully", "Status": "true" });
        }
    })

});
router.delete('/delete/:id', (req, res, next) => {
    const medicine_id = req.params.id;
    connection.query('DELETE FROM Prescription_Details WHERE prescrip_second_id = ?',medicine_id,(err,results)=>{
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