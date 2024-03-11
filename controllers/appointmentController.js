const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
  try {
    const { firstName, lastName, email, countryCode, phoneNumber, selectedDate, selectedTime, consultationPurpose, message } = req.body;
    console.log('Received appointment data:', req.body); // Log the received data
    const appointment = new Appointment({ firstName, lastName, email, countryCode, phoneNumber, selectedDate, selectedTime, consultationPurpose, message });
    await appointment.save();
    console.log('Appointment created:', appointment);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};