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
    // 🛑 1. CHECK THE SEAT LIMIT FIRST
    const MAX_SEATS = 110;
    const totalRegistered = await User.countDocuments();
    
    if (totalRegistered >= MAX_SEATS) {
      return res.status(403).json({ 
        success: false, 
        message: "Registration closed. All 110 seats are fully booked!" 
      });
    }

    // 2. Process the input
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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AlgoVerse Registration Confirmed</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937;">
          
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                  
                  <tr>
                    <td style="background: linear-gradient(135deg, #030712 0%, #111827 100%); padding: 40px 30px; text-align: center; border-bottom: 4px solid #7C3AED;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; letter-spacing: -0.5px;">Algo<span style="color: #00D4FF;">Verse</span></h1>
                      <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Build Your First AI Agent</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; font-size: 22px; color: #111827;">You're in, ${name.split(' ')[0]}! 🎉</h2>
                      
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                        Your spot for the <strong>AlgoVerse Workshop</strong> has been officially confirmed. Get ready to dive into the world of Artificial Intelligence and build your very own machine learning model from scratch.
                      </p>

                      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #0f172a;">Your Registration Details:</h3>
                        <p style="margin: 5px 0; color: #475569; font-size: 14px;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 5px 0; color: #475569; font-size: 14px;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 5px 0; color: #475569; font-size: 14px;"><strong>Department:</strong> ${department}</p>
                      </div>

                      <div style="background-color: #f3f4f6; border-left: 4px solid #00D4FF; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #111827;">What to bring:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                          <li>Your Laptop (Mandatory for hands-on coding)</li>
                          <li>A Google Account (To access Google Colab)</li>
                          <li>An eagerness to learn (No prior AI experience needed!)</li>
                        </ul>
                      </div>

                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                        <tr>
                          <td align="center">
                            <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #6b21a8; text-transform: uppercase; letter-spacing: 1px;">A Premium Collaboration</h3>
                            <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.6; color: #4b5563; text-align: center;">
                              This event is proudly organized by the <strong>SRMIST AAAI Student Chapter</strong> in exclusive collaboration with <strong>Kuralara WebFlux</strong>. <br><br>
                              <em style="font-size: 13px;">The AlgoVerse digital platform and registration architecture were engineered and provided by Kuralara WebFlux.</em>
                            </p>
                          </td>
                        </tr>
                      </table>

                      <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #111827; text-align: center;">Connect With Us</h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="50%" align="center" style="padding: 10px;">
                            <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; color: #374151;">AAAI SRMIST</p>
                            <a href="https://www.linkedin.com/company/srmist-aaai-student-chapter" style="display: inline-block; padding: 8px 15px; background-color: #0077b5; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold; margin-bottom: 8px;">LinkedIn</a><br>
                            <a href="https://www.instagram.com/aaai_srmist" style="display: inline-block; padding: 8px 15px; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold;">Instagram</a>
                          </td>
                          
                          <td width="50%" align="center" style="padding: 10px; border-left: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; color: #374151;">Kuralara WebFlux</p>
                            <a href="https://www.linkedin.com/company/kuralarawebflux" style="display: inline-block; padding: 8px 15px; background-color: #0077b5; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold; margin-bottom: 8px;">LinkedIn</a><br>
                            <a href="https://www.instagram.com/kuralara_webflux" style="display: inline-block; padding: 8px 15px; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold;">Instagram</a>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>

                  <tr>
                    <td style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; font-size: 12px; color: #6b7280;">
                        © 2026 AAAI Student Chapter, SRMIST.<br>
                        Crafted with Innovation ⚡ by Kuralara WebFlux
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>

        </body>
        </html>
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