require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const User = require("./models/User"); // Make sure this path is correct

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Atlas Connected!");
    console.log("📥 Fetching registered participants...");

    const users = await User.find({}, "name phone");

    if (users.length === 0) {
      console.log("⚠️ No users found in the database yet.");
      process.exit();
    }

    // Prepare CSV Header
    let csvContent = "Name,Phone\n";

    users.forEach(user => {
      // Clean up the phone number (remove spaces/dashes)
      let phone = user.phone.toString().replace(/\D/g, '');
      
      // If it's a standard 10-digit Indian number, add the 91 country code
      // (Most WhatsApp bulk senders require the country code)
      if (phone.length === 10) {
        phone = "91" + phone;
      }

      csvContent += `${user.name},${phone}\n`;
    });

    // Write to a file
    fs.writeFileSync("whatsapp_contacts.csv", csvContent);
    
    console.log(`✅ Success! Extracted ${users.length} contacts.`);
    console.log(`📁 File saved as: whatsapp_contacts.csv in your backend folder.`);
    process.exit();
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });