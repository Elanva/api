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
const LabRoute = require('./routes/lab.route');
const DoctorRoute = require('./routes/doctor.route');
const NurseRoute = require('./routes/nurse.route');
const PharmacyRoute = require('./routes/pharmacy.route');
const InvoiceRoute = require('./routes/invoice.route');
app.use('/api/doctors', DoctorRoute);
app.use('/api/nurses', NurseRoute);
app.use('/api/patients', PatientRoute);
app.use('/api/users', UserRoute);
app.use('/api/medicine', MedicineRoute);
app.use('/api/meditype', Medicine);
app.use('/api/prescriptions', PrescriptionRoute);
app.use('/api/lab', LabRoute);
app.use('/api/pharmacy', PharmacyRoute);
app.use('/api/invoice', InvoiceRoute);
var port= process.env.API_PORT;

app.listen(port, ()=>{console.log('Server running at' + port);});
