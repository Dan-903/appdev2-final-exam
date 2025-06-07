# AppDev2 Finals API

## 📌 Introduction
This is a RESTful API for managing users and events. Users can register, log in, create events, and receive email notifications upon event creation. The API is built with Node.js, Express, MongoDB, and uses JWT for authentication. Email notifications are sent using Nodemailer and Pug templates.

## 🔗 Live Demo
[View the deployed API on Render](https://appdev2-final-exam-ttg3.onrender.com)

## ⚙️ Running the Project Locally
1. **Clone the repository:**
   ```sh
   git clone https://github.com/dan-903/appdev2-finals.git
   cd appdev2-finals
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your values.
   ```sh
   cp .env.example .env
   # (On Windows, use: copy .env.example .env)
   ```
4. **Start the server:**
   ```sh
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

The API will be available at `http://localhost:5000` (or your specified PORT).

## 🧪 Running the Seeder
To populate the database with fake users and events:
```sh
npm run seeder
```
This will clear all users and events, then seed 5 users and 10 events.

## 🛠️ Environment Variables
Below is the required `.env.example` file:

```env
MONGO_URI=MongoDB_connection_string_here
JWT_SECRET=Your_JWT_secret_here
PORT=PORT_number_here
EMAIL_USER=Email_username_here
EMAIL_PASS=Email_password_here
```

