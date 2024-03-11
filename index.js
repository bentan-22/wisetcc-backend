require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");

const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../wisetcc-frontend/build")));

// Define Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send email notification
async function sendEmailNotification(appointmentData) {
  try {
    // Send mail with defined transport object
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_USER,
      subject: 'New Appointment Booking',
      html: `
        <p>Hello,</p>
        <p>A new appointment has been booked.</p>
        <p>Details:</p>
        <ul>
          <li>First Name: ${appointmentData.firstName}</li>
          <li>Last Name: ${appointmentData.lastName}</li>
          <li>Email: ${appointmentData.email}</li>
          <li>Phone Number: ${appointmentData.countryCode} ${appointmentData.phoneNumber}</li>
          <li>Date: ${appointmentData.selectedDate}</li>
          <li>Time: ${appointmentData.selectedTime}</li>
          <li>Purpose: ${appointmentData.consultationPurpose}</li>
          <li>Message: ${appointmentData.message}</li>
        </ul>
      `
    });
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

// Define your API routes
app.use("/api/appointments", appointmentRoutes);

// Endpoint for sending email notification
app.post("/api/send-email-notification", async (req, res) => {
  try {
    // Extract appointment data from request body
    const appointmentData = req.body;
    // Send email notification
    await sendEmailNotification(appointmentData);
    // Respond with success message
    res.status(200).json({ message: "Email notification sent successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error sending email notification:", error);
    res.status(500).json({ error: "Failed to send email notification" });
  }
});

// Handle other routes by serving the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../wisetcc-frontend/build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});