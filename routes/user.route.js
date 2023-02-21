const express = require('express');
const router = express.Router();
const dbconfig = require('../dbconfig');
const connection = dbconfig.getConnection();  
//Users CRUD Operations
// 1. Get All Users details
router.get('/', (req, res, next) => {
    connection.query("SELECT * FROM User_Master", (err, results, fields) => {
        if (err) {
            res.json({ "Data" :  res.sendStatus(500), "Status": "false" })            
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
//Users Searrch
router.get('/search', async (req, res, next) => {
    const User_Id = req.query.name;
    let sql = `CALL UserSearch(?)`;
    connection.query(sql, [User_Id], (err, results) => {
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
// 2. Chck username and Password is correct or Not
router.post('/', (req, res) => {
    connection.query("SELECT * FROM User_Master WHERE User_Name=? AND Password = ? ",[req.body.User_Name,req.body.Password ],(err, results, fields) => {
        if (err) {
           console.log(err)
            return;
        }
        else if (results == 0) {
            res.json({ "Data": "Data not Found", "Status": "false" })
            connection.end;
        }
        else {
            res.json({ "Data": results[0], "Status": "true" })
        }
     
    });
})
//3.Add User details
router.post('/create', async (req, res) => {
    const data = req.body;
    connection.query('INSERT INTO User_Master SET ?', data, (err, results) => {
        if (err) {
            res.json({ "Data": res.sendStatus(500), "Status": "false" });
            return;
        }
        else {
            res.json({ "Data": "Record " + results.insertId + " Inserted", "Status": "true" });
        }
    })
})
// 4. Update Doctor Detail
router.put('/update/:id', async (req, res) => {
    const User_Id = req.params.id;
    const data = [req.body.User_Name, req.body.Password,req.body.Role,User_Id];
    connection.query('UPDATE User_Master SET User_Name = ?, Password = ?,Role = ? WHERE User_Id =? ', data, (err, results) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        else {
            res.json({ "Data": "Record Updated Successfully", "Status": "true" });
        }
    })

});
//5. Delete User by Id
router.delete('/delete/:id', (req, res, next) => {
    const userid = req.params.id;
    connection.query('DELETE FROM User_Master WHERE User_Id = ?',userid,(err,results)=>{
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