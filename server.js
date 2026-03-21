const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const User = require("./models/User"); 

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("✅ ALGOVERSE BACKEND IS ALIVE AND WORKING!");
});

// Registration API Route
app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, department, year, experience_level } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    // Create new user in DB
    const newUser = new User({
      name, email, phone, department, year, experience_level
    });

    await newUser.save();

    // 🚀 Send the Automated Welcome Email via BREVO API
    const emailPayload = {
      sender: { name: "AlgoVerse Team", email: "kuralarawebflux@gmail.com" },
      to: [{ email: email, name: name }],
      subject: "🎉 Welcome to AlgoVerse! Your Registration is Confirmed.",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0A0D14; color: #f0f4ff; padding: 30px; border-radius: 15px; border: 1px solid #7c3aed;">
          <h2 style="color: #00D4FF; margin-top: 0;">You're In, ${name.split(' ')[0]}! 🚀</h2>
          <p style="color: #d1d5db; font-size: 16px; line-height: 1.6;">Your seat for the <strong>AlgoVerse AI Hackathon & Workshop</strong> is officially confirmed. We are thrilled to have you join us!</p>
          
          <div style="background-color: #1f2937; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #00D4FF;">
            <h3 style="margin-top: 0; color: #ffffff;">Your Registration Details:</h3>
            <p style="margin: 8px 0; color: #d1d5db;"><strong>👤 Name:</strong> ${name}</p>
            <p style="margin: 8px 0; color: #d1d5db;"><strong>📧 Email:</strong> ${email}</p>
            <p style="margin: 8px 0; color: #d1d5db;"><strong>🎓 Department:</strong> ${department}</p>
          </div>
          
          <p style="color: #d1d5db; font-size: 14px; line-height: 1.5;"><strong>Important:</strong> Please ensure you bring your laptop and have a stable internet connection. We will send out the final schedule and Google Colab links soon.</p>
          
          <p style="color: #9D4EDD; font-weight: bold; margin-top: 30px; font-size: 16px;">See you in the Verse,<br>The AlgoVerse Team</p>
        </div>
      `
    };

    // Fire off the API request asynchronously
    fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify(emailPayload)
    })
    .then(async (response) => {
      if (!response.ok) {
        console.error("🔥 Brevo API Error:", await response.text());
      } else {
        console.log("✅ Welcome email sent successfully via Brevo API to:", email);
      }
    })
    .catch((error) => console.error("🔥 Email fetch failed:", error));

    // Send success response to frontend immediately
    res.status(201).json({ success: true, message: "Registration successful!" });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://127.0.0.1:${PORT}`);
});