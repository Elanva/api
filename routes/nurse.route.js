const express = require('express');
const router = express.Router();
const dbconfig = require('../dbconfig');
const connection = dbconfig.getConnection();

//Doctors CRUD Operations
// 1. Get All Doctors details
router.get('/', (req, res, next) => {
    connection.query("SELECT * FROM Nurses_Master", (err, results, fields) => {
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
    const Nurse_Id = req.query.name;
    let sql = `CALL NurseSearch(?)`;
    connection.query(sql, [Nurse_Id], (err, results) => {
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
    const Nurse_Id = req.params.id;
    let sql = "SELECT * FROM Nurses_Master where Nurse_Id = (?)";
    connection.query(sql, [Nurse_Id], (err, results) => {
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
    connection.query('INSERT INTO Nurses_Master SET ?', data, (err, results) => {
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
    const nurseid = req.params.id;
    const data = [req.body.Nurse_Name,req.body.Nurse_Age,req.body.Date_Joining,req.body.Mobile,req.body.Address,req.body.Specialist,req.body.Salary,nurseid];
    connection.query('UPDATE Nurses_Master SET Nurse_Name = ?, Nurse_Age = ?,Date_Joining = ?, Mobile=?,Address=?,Specialist=?,Salary=? WHERE Nurse_Id =? ', data, (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else if(results.affectedRows == 0){
            res.json({ "Data": "No record found", "Status": "false" });
        }
        else {
            console.log(results)
            res.json({ "Data": "Record Updated Successfully", "Status": "true" });
        }
       
    })

});
//5. Delete Doctor by Id
router.delete('/delete/:id', (req, res, next) => {
  const nurseid = req.params.id;
  connection.query('DELETE FROM Nurses_Master WHERE Nurse_Id = ?',nurseid,(err,results)=>{
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


module.exports = router;