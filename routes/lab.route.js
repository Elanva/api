const express = require('express');
const router = express.Router();
const dbconfig = require('../dbconfig');
const connection = dbconfig.getConnection();

//Medicine CRUD Operations

//LAB CRUD Operations 
router.get('/patientlist/', (req, res, next) => {
    connection.query("select First_Name,Patient_Id,Phone_No, Status from Lab_Primary where Status='Waiting For LAB'",(err, results, fields) => {
      if (err) {
          res.sendStatus(500);
          return;
      }
      else if (results == 0) {
          res.json({  "Data": [{ }], "Status": "false" })
      }
      else {
          res.json({ "Data": results, "Status": "true" })
      }

  });
})
//set status true or 1 to check whether prescripton Prmary data Saved or not
router.get('/Lab_Primary/:id', (req, res, next) => {
    const Patient_Id = req.params.id;
    connection.query("select setstatus from Lab_Primary Where Patient_Id= ?", Patient_Id,(err, results, fields) => {
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
router.get('/labPrimarystatus/:id', (req, res, next) => {
    const Patient_Id = req.params.id;
    connection.query("select setstatus,doctor_fees from Lab_Primary  Where Patient_Id= ?", Patient_Id,(err, results, fields) => {
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
//Get Lab_Details Table data by ID
// get Prescrription Detail by Patient Id
router.get('/getlabbyid/:id', async (req, res, next) => {
    const patient_id = req.params.id;
    let sql = "select Lab_Details.lab_second_id,Lab_Details.Patient_Id,Lab_Details.medicine_id,Lab_Details.medicine_name,Lab_Details.amount,Lab_Details.Test_Type,Lab_Details.quantity,Medicine_Master.mrp_rate,Medicine_Master.GST_percentage,(Medicine_Master.mrp_rate + Medicine_Master.mrp_rate*Medicine_Master.GST_percentage/100) * (Lab_Details.quantity)as totalamt,Medicine_Master.in_stock_total from Lab_Details INNER JOIN Medicine_Master ON Lab_Details.medicine_id=Medicine_Master.medicine_id where Lab_Details.added_on = CURDATE() and Lab_Details.status = 0 and Lab_Details.Patient_Id = (?)";
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
//Lab Primary Status

//Update status "Waiting For Pharmacy" in Patients_Master Table once prescription added
//need to work on prescription screen
router.put('/updatestatus/:id', async (req, res) => {
    const patient_id = req.params.id;
    connection.query('update Patients_Master set Status="Waiting For LAB" WHERE Patient_Id = ? AND Status = "Waiting For Doctor"', patient_id, (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else {
            res.json({ "Data": "Record Updated Successfully", "Status": "true" });
        }
    })

});
// Add Lab Primary Details
router.post('/addlabPrimary', async (req, res) => {
    const data = req.body;
    connection.query('INSERT INTO Lab_Primary SET ?', data, (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else {
            res.json({ "Data": "Record " + results.insertId + " Inserted", "Status": "true" });
        }
    })

});
router.post('/addlabSecondary', async (req, res) => {
    const data = req.body;
    connection.query('INSERT INTO Lab_Details SET ?', data, (err, results) => {
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
    const data = [req.body.medicine_id,req.body.medicine_name,req.body.no_of_days, req.body.quantity,req.body.morning, req.body.afternoon,req.body.night,req.body.Patient_Id, prscription_id];
    connection.query('UPDATE Lab_Details SET medicine_id = ?, medicine_name = ?, no_of_days=?, quantity=?,morning=?, afternoon=?, night=?, Patient_Id=? WHERE lab_second_id =? ', data, (err, results) => {
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
    connection.query('UPDATE Lab_Details SET status = "1" WHERE Lab_Details.Patient_Id = ? and Lab_Details.medicine_id = ?',[ patientid,medicineid],(err, results) => {
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
    connection.query('UPDATE Lab_Details,Patients_Master,Lab_Primary SET Lab_Details.status = 1, Patients_Master.Status = "Done",Prescription_Primary.status="Done" WHERE Prescription_Details.Patient_Id =? and Patients_Master.Patient_Id =? and Prescription_Primary.Patient_Id=? and Patients_Master.Status = "Waiting For Pharmacy"and Prescription_Primary.status = "Waiting For Pharmacy"',[patientid,patientid,patientid],(err, results) => {
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
    const lab_id = req.params.id;
    connection.query('DELETE FROM Lab_Details WHERE lab_second_id = ?',lab_id,(err,results)=>{
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