const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors');
require('dotenv').config();
app.use(cors());
app.options('*', cors()) // include before other routes
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const UserRoute = require('./routes/user.route');
const PatientRoute = require('./routes/patient.route');
const MedicineRoute = require('./routes/medicine.route');
const Medicine = require('./routes/medicinetype.route');
const PrescriptionRoute = require('./routes/prescription.route');
const DoctorRoute = require('./routes/doctor.route');
const NurseRoute = require('./routes/nurse.route');

app.use('/api/doctors', DoctorRoute);
app.use('/api/nurses', NurseRoute);
app.use('/api/patients', PatientRoute);
app.use('/api/users', UserRoute);
app.use('/api/medicine', MedicineRoute);
app.use('/api/meditype', Medicine);
app.use('/api/prescriptions', PrescriptionRoute);
var port= process.env.API_PORT;

app.listen(port, ()=>{console.log('Server running at' + port);});
