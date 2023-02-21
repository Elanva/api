const express = require('express');
const router = express.Router();
const dbconfig = require('../dbconfig');
const connection = dbconfig.getConnection();

//Doctors CRUD Operations
// 1. Get All Doctors details

router.get('/', (req, res, next) => {  
    connection.query("SELECT * FROM Doctors_Master", (err, results, fields) => {
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
// Search Doctors by name
router.get('/search', async (req, res, next) => {
    const Doctor_Id = req.query.name;
    let sql = `CALL DoctorSearch(?)`;
    connection.query(sql, [Doctor_Id], (err, results) => {
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
// 2. Doctors name by Id
router.get('/:id', async (req, res, next) => {
    const doctorid = req.params.id;
    let sql = "SELECT * FROM Doctors_Master where Doctor_Id = (?)";
    connection.query(sql, [doctorid], (err, results) => {
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
    connection.query('INSERT INTO Doctors_Master SET ?', data, (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else {
            res.json({ "Data": "Record " + results.insertId + " Inserted", "Status": "true" });
        }
    })

});

// 4. Update Doctor Detail
router.put('/update/:id', async (req, res) => {
    const doctorid = req.params.id;
    const data = [req.body.Doctor_Name,req.body.Doctor_Age,req.body.Date_Joining,req.body.Mobile,req.body.Address,req.body.Specialist,req.body.Salary,doctorid];
    connection.query('UPDATE Doctors_Master SET Doctor_Name = ?, Doctor_Age = ?,Date_Joining = ?, Mobile=?,Address=?,Specialist=?,Salary=? WHERE Doctor_Id =? ', data, (err, results) => {
        if (err) {
           // res.sendStatus(500);
           return;
           
        }
        else {
            res.json({ "Data": "Record " + results.insertId + " Updated Successfully", "Status": "true" });
        }
    })

});
//5. Delete Doctor by Id
router.delete('/delete/:id', (req, res, next) => {
  const doctorid = req.params.id;
  connection.query('DELETE FROM Doctors_Master WHERE Doctor_Id = ?',doctorid,(err,results)=>{
      if(err){
        res.json({ "Data": "Data mapped with other Table", "Status": "false" });
      }
      else if(results.affectedRows == 0){
        res.json({ "Data": "Record not found", "Status": "false" });
      }
      else if(results.affectedRows == 1){
        res.json({ "Data": "Record Deleted Successfully", "Status": "true" });
      }           
    
  })
})


module.exports = router;