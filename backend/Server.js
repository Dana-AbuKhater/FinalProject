const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const SalonRoutes = require('./routes/SalonRoutes');
const CustomerRoutes = require('./routes/CustomerRoutes');
const ServiceRoutes = require('./routes/ServiceRoutes');
const AppointmentsRoutes = require('./routes/AppointmentsRoutes');
const RatingRoutes = require('./routes/RatingRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ DB Connection Error", err));

app.use('/api/salons', SalonRoutes);
app.use('/api/customers', CustomerRoutes);
app.use('/api/services', ServiceRoutes);
app.use('/api/appointments', AppointmentsRoutes);
app.use('/api/ratings', RatingRoutes);
app.use('/api/auth', authRoutes);
app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000");
});