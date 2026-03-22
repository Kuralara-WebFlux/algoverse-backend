# 🚀 AlgoVerse Registration API

The robust, high-performance Node.js/Express backend powering the **AlgoVerse AI Workshop** registration system. Engineered by [Kuralara WebFlux](https://www.linkedin.com/company/kuralarawebflux) in collaboration with the SRMIST AAAI Student Chapter.

## ✨ Features

* **Secure REST API:** Fast and lightweight Express server for handling student registrations.
* **Database Integration:** Persistent data storage using **MongoDB Atlas** and Mongoose.
* **Smart Validation:** Built-in checks to prevent duplicate registrations using the same email address (Returns `409 Conflict`).
* **Automated Email Engine:** Integrates with the **Brevo API** to instantly send premium, responsive HTML confirmation emails to users upon successful registration.
* **Cross-Origin Ready:** Fully configured with CORS to seamlessly accept requests from the deployed React frontend.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Atlas) & Mongoose
* **Email Service:** Brevo (formerly Sendinblue) API
* **Middleware:** CORS, Express JSON parser, Dotenv

## ⚙️ Environment Variables

To run this project locally, you must create a `.env` file in the root directory and add the following keys. *(Note: Never commit your `.env` file to version control!)*

\`\`\`env
PORT=8000
MONGO_URI=your_mongodb_atlas_connection_string
BREVO_API_KEY=your_brevo_v3_api_key
\`\`\`

## 🚀 Installation & Setup

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/algoverse-backend.git
   cd algoverse-backend
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up your environment variables:**
   Create a `.env` file and populate it with your database and API keys as shown above.

4. **Start the development server:**
   \`\`\`bash
   npm run dev
   # OR
   node server.js
   \`\`\`
   *The server will start on `http://localhost:8000` (or your defined PORT).*

## 📡 API Documentation

### `GET /`
Health check endpoint to verify the server is running.
* **Response:** `200 OK` - "✅ ALGOVERSE BACKEND IS ALIVE AND WORKING!"

### `POST /register`
Registers a new student for the workshop and triggers the confirmation email.

**Request Body (JSON):**
\`\`\`json
{
  "name": "John Doe",
  "email": "johndoe@srmist.edu.in",
  "phone": "9876543210",
  "department": "CSE (AI & ML)",
  "year": "2",
  "experience_level": "Beginner"
}
\`\`\`

**Success Response (201 Created):**
\`\`\`json
{
  "success": true,
  "message": "Registration successful!"
}
\`\`\`

**Error Responses:**
* `409 Conflict`: If the email already exists in the database.
* `500 Internal Server Error`: If the database connection fails or the server encounters an issue.

## 👨‍💻 Credits

**Backend Architecture & Deployment:** Developed by **Kuralara WebFlux** 🌐 [LinkedIn](https://www.linkedin.com/company/kuralarawebflux) | 📸 [Instagram](https://www.instagram.com/kuralara_webflux)

**Event Organized By:** **SRMIST AAAI Student Chapter** 🌐 [LinkedIn](https://www.linkedin.com/company/srmist-aaai-student-chapter) | 📸 [Instagram](https://www.instagram.com/aaai_srmist)