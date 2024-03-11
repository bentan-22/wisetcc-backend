const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  countryCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  selectedDate: { type: Date, required: true },
  selectedTime: { type: String, required: true },
  consultationPurpose: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;