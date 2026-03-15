require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const axios = require("axios");
const bodyParser = require("body-parser");
const ejs_mate = require('ejs-mate')
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const expressLayouts = require("express-ejs-layouts");
const { Problem } = require('./models/problems');
const chatbotRoutes = require('./routes/chatbot');
const profileRoutes = require("./routes/profile");
const quizbotRouter = require('./routes/quizbot');
const authRoutes = require("./routes/auth");
const learnRoutes = require("./routes/learn");

const puppeteer = require('puppeteer');

mongoose.connect('mongodb://127.0.0.1:27017/Learnova').then(()=>{
    console.log("connected successfully")
})
const app = express();
app.use(
    session({
        secret: "learnova_secret_key",
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: "mongodb://127.0.0.1:27017/Learnova"
        }),

        cookie: {
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        }
    })
);

const port = process.env.PORT || 8080;

const isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/auth/login");
  }
  next();
};
const User = require("./models/user");

app.use(async (req, res, next) => {

  if (req.session.userId) {
    const user = await User.findById(req.session.userId).select("username email");
    res.locals.currentUser = user;
  } else {
    res.locals.currentUser = null;
  }

  next();
});


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/chatbot', chatbotRoutes); 
app.use("/profile", profileRoutes);
app.use('/quizbot', quizbotRouter);
app.use("/auth", authRoutes);
app.use("/learn", learnRoutes);


// Serve static files + EJS
const path = require("path");
app.engine('ejs',ejs_mate);
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname,"public/CSS")))
// Routes
app.get("/", isLoggedIn, (req, res) => {
  res.render("home");
});


app.get("/compiler", (req, res) => {
  res.render("compiler");
});

// Debug endpoint
app.get("/debug", (req, res) => {
  res.json({
    judge0_key: process.env.JUDGE0_KEY ? "Present" : "Missing",
    judge0_host: process.env.JUDGE0_HOST || "Not set",
    status: "Server is running"
  });
});

app.get("/languages", async (req, res) => {
  try {
    console.log("Fetching languages from Judge0...");
    
    const response = await axios.get("https://judge0-extra-ce.p.rapidapi.com/languages", {
      headers: {
        "X-RapidAPI-Key": process.env.JUDGE0_KEY,
        "X-RapidAPI-Host": "judge0-extra-ce.p.rapidapi.com"
      },
      timeout: 10000
    });
    
    console.log("Successfully fetched languages");
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching languages:", err.response?.data || err.message);
    res.status(500).json({ 
      error: "Error fetching languages",
      details: err.response?.data || err.message 
    });
  }
});

// FIXED POST route to run code
app.post("/run", async (req, res) => {
  const { language_id, source_code, stdin } = req.body;

  // Validation
  if (!language_id || !source_code) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // CORRECT ENDPOINT - submissions, not submission
    const response = await axios.post(
      "https://judge0-extra-ce.p.rapidapi.com/submissions", // FIXED URL
      {
        source_code,
        language_id: parseInt(language_id),
        stdin: stdin || "",
        base64_encoded: false
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.JUDGE0_KEY,
          "X-RapidAPI-Host": "judge0-extra-ce.p.rapidapi.com"
        },
        params: {
          base64_encoded: 'false',
          wait: 'true'
        },
        timeout: 20000
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Error executing code:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    
    res.status(500).json({ 
      error: "Error executing code",
      details: err.response?.data || err.message 
    });
  }
});

app.get("/practice", async (req, res) => {
    try {
        const problems = await Problem.find({});
        res.render("practice", { problems });
    } catch (err) {
        console.error("Error fetching problems:", err);
        res.status(500).send("Error loading practice problems");
    }
});
app.get("/problems/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).send("Problem not found");
    }
    // Render "problem.ejs" and pass problem data
    res.render("problem", { problem });
  } catch (err) {
    console.error("Error fetching problem:", err);
    res.status(500).send("Error loading problem");
  }
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Debug endpoint: http://localhost:${port}/debug`);
});