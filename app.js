const path = require("path");

require("dotenv").config({
  // .env file load karo login folder se hi,
  // chahe server kahin se bhi start kiya ho (root ya login folder)
  path: path.join(__dirname, ".env")
});

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const authRoutes = require("./routes/auth");

const app = express();


// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error);
  });


// ===============================
// EJS
// ===============================
app.set("view engine", "ejs");

// Views folder fix: Express by default process.cwd() ke
// relative "views" folder dhundhta hai. Server root se start
// karne par views folder nahi milta (500 error).
// Isliye views ka path explicitly login folder par set kiya.

app.set("views", path.join(__dirname, "views"));


// ===============================
// Middleware
// ===============================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ===============================
// Session
// ===============================
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);


// ===============================
// Public Files
// ===============================
app.use(
  express.static(path.join(__dirname, "public"))
);


// ===============================
// Login Protection (Route Guard)
// ===============================
// TravelNest pages sirf logged-in users dekh sakte hain.
// Agar session me userId nahi hai to login page par bhej do.

function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }

  return res.redirect("/login");
}


// ===============================
// TravelNest Folder
// ===============================
// Note: travellnest1 folder login folder ke bahar hai
// (project root par), isliye ".." lagana zaroori hai.

app.use(
  "/travellnest",
  requireLogin,
  express.static(path.join(__dirname, "..", "travellnest1"))
);


// ===============================
// TravelNest Main Page
// ===============================
app.get("/travellnest", requireLogin, (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "travellnest1", "index.html")
  );
});


// ===============================
// Home
// ===============================
app.get("/", (req, res) => {
  res.redirect("/login");
});


// ===============================
// Auth Routes
// ===============================
app.use("/", authRoutes);


// ===============================
// Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});