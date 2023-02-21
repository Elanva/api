const express = require('express');
const router = express.Router();
const dbconfig = require('../dbconfig');
const connection = dbconfig.getConnection();


//Invoice CRUD Operations
//Get Invoice Details by Patient Id (OUT PATIENT)
router.get('/pharmacyinvoicelist/', (req, res, next) => {
      connection.query("select First_Name,Patient_Id,Doctor_fees,Amount,added_on from Invoice_Master_OP ORDER BY added_on DESC",(err, results, fields) => {
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

//Get Invoice Details for LAB (OTHER PATIENT)
router.get('/labinvoicelist', (req, res, next) => {
    connection.query("select Test_id,Patient_Name,Mobile,Test_Name,Rate,Date_Visit from Lab_TestInfo_OP ORDER BY Date_Visit ASC",(err, results, fields) => {
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



//3.Add Out Patient Invoice Medicne and Doctor fees details
router.post('/addoutpatientinvoice', async (req, res) => {
    const data = req.body;
    connection.query('INSERT INTO Invoice_Master_OP SET ?', data, (err, results) => {
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
router.put('/statusafterinvoice/:id', async (req, res) => {
    const patient_id = req.params.id;
//    update Patients_Master,Prescription_Primary set Patients_Master.Status="Done",Prescription_Primary.status="Done" WHERE Patients_Master.Patient_Id = 20 AND Patients_Master.Status = 'Waiting For Pharmacy' and Prescription_Primary.Patient_Id = 20 AND Prescription_Primary.Status = 'Waiting For Pharmacy'
    connection.query("update Patients_Master,Prescription_Primary set Patients_Master.Status='Done',Prescription_Primary.status='Done' WHERE Patients_Master.Patient_Id = ? AND Patients_Master.Status = 'Waiting For Pharmacy' and Prescription_Primary.Patient_Id = ? AND Prescription_Primary.status = 'Waiting For Pharmacy'", [patient_id,patient_id], (err, results) => {
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