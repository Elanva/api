const express = require('express');
const router = express.Router();
const dbconfig = require('../dbconfig');
const connection = dbconfig.getConnection();

//Doctors CRUD Operations
// 1. Get All Doctors details
router.get('/', (req, res) => {
    connection.query("SELECT * FROM Patients_Master", (err, results) => {
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
//Show Particular Patient data based on Patient Id
router.get('/patientinfo/:id', (req, res) => {
    const Patient_Id = req.params.id;
    let sql = "SELECT * FROM Patients_Master where Patient_Id = (?)";
    connection.query(sql, [Patient_Id], (err, results) => {
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
router.get('/inpatienthistory/:id', (req, res) => {
   // .query("select * from InPatient_Details where Patient_Id = @input_parameter ");
   const Patient_Id = req.params.id;
    let sql = "SELECT * FROM InPatientHistory_Details where Patient_Id = (?)";
    connection.query(sql, [Patient_Id], (err, results) => {
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
router.get('/outpatienthistory/:id', (req, res) => {
    
    //.query("select * from OutPatient_Details where Patient_Id = @input_parameter ");
    const Patient_Id = req.params.id;
     let sql = "SELECT * FROM OutPatientHistory_Details where Patient_Id = (?)";
     connection.query(sql, [Patient_Id], (err, results) => {
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
// Delete Out Patient Hstory by Hstory Id
router.delete('/ophistorydelete/:id', (req, res) => {
    
    //.query("select * from OutPatient_Details where Patient_Id = @input_parameter ");
    const History_Id = req.params.id;
     let sql = "DELETE FROM OutPatientHistory_Details where History_Id = (?)";
     connection.query(sql, [History_Id], (err, results) => {
         if (err) {
             res.sendStatus(500);
             return;
         }
         else if (results == 0) {
             res.json({ "Data": "Data not Found", "Status": "false" });
         }
         else {
            res.json({ "Data": "Record Deleted Successfully", "Status": "true" });
         }
 
     });
 });
// Search Doctors by name
router.get('/patient', async (req, res) => {
    const First_Name = req.query.name;
    let sql = `CALL PatientSearch(?)`;
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
// Get Patient by Doctor Id

router.get('/bydoctorId/:id', async (req, res) => {
    const Doctor_Id = req.params.id;
    let sql = "SELECT * FROM Patients_Master where Doctor_Id = (?)";
    connection.query(sql, [Doctor_Id], (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else if (results == 0) {
            res.json({ "Data": [{ }], "Status": "false" });
        }
        else {
            res.json({ "Data": results, "Status": "true" });
        }
    })
})
// 2. Doctors name by Id
router.get('/:id', async (req, res) => {
    const Patient_Id = req.params.id;
    let sql = "SELECT * FROM Patients_Master where Doctor_Id = (?)";
    connection.query(sql, [Patient_Id], (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else if (results == 0) {
            res.json({ "Data": "[{ }]", "Status": "false" });
        }
        else {
            res.json({ "Data": results[0], "Status": "true" });
        }

    });
});

//3.Add Patient details
router.post('/create', async (req, res) => {
    const data = req.body;
    connection.query('INSERT INTO Patients_Master SET ?', data, (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else {
            res.json({ "Data": "Record " + results.insertId + " Inserted", "Status": "true" });
        }

    })

});
//OutPatient History create/save Ap service
router.post('/outpatienthistory/create', async (req, res) => {
    const data = req.body;
    connection.query('INSERT INTO OutPatientHistory_Details SET ?', data, (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else {
            res.json({ "Data": "Record " + results.insertId + " Inserted", "Status": "true" });
        }
    })

});

// 4. Update Patient Detail
router.put('/update/:id', async (req, res) => {
    const Patient_Id = req.params.id;
    const data = [req.body.First_Name, req.body.Last_Name, req.body.DOB, req.body.Age, req.body.Gender, req.body.Father_Name, req.body.Address, req.body.Phone_No, req.body.Blood_Type, req.body.Height, req.body.Weight, req.body.Diet, req.body.Allergic, req.body.History, req.body.Blood_Pressure, req.body.Patient_Type, req.body.Doctor_Id, req.body.Date_Visit, req.body.Illness, req.body.Temperature, req.body.Status, Patient_Id];
    connection.query('UPDATE Patients_Master SET First_Name = ?, Last_Name = ?,DOB = ?, Age=?,Gender=?,Father_Name=?,Address=?,Phone_No=?,Blood_Type=?,Height=?,Weight=?,Diet=?,Allergic=?,History=?,Blood_Pressure=?,Patient_Type=?,Doctor_Id=?,Date_Visit=?,Illness=?,Temperature=?,Status=? WHERE Patient_Id =? ', data, (err, results) => {
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
router.delete('/delete/:id', (req, res) => {
    const Patient_Id = req.params.id;
    connection.query('DELETE FROM Patients_Master WHERE Patient_Id = ?', Patient_Id, (err, results) => {
        if (err) {
            throw err;
        }
        else if (results.affectedRows == 0) {
            res.json({ "Data": "Record not found", "Status": "false" });
        }
        else if (results.affectedRows == 1) {
            res.json({ "Data": "Record Deleted Successfully", "Status": "true" });
        }


    })
})


module.exports = router;