const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();


// REGISTER PAGE
router.get("/register", (req, res) => {

    if (req.session.userId) {
        return res.redirect("/");
    }

    res.render("register");
});



// LOGIN PAGE
router.get("/login", (req, res) => {

    if (req.session.userId) {
        return res.redirect("/");
    }

    res.render("login");
});



// REGISTER USER
router.post("/register", async (req, res) => {

    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.render("register", { error: "All fields required" });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.render("register", { error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.redirect("/auth/login");

    } catch (err) {
        console.log(err);
        res.render("register", { error: "Registration failed" });
    }

});


// LOGIN USER
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.render("login", { error: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render("login", { error: "Invalid Credentials" });
        }

        // SESSION STORE
        req.session.userId = user._id;

        res.redirect("/");

    } catch (err) {
        console.log(err);
        res.render("login", { error: "Login Failed" });
    }

});


// LOGOUT
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("login");
});

module.exports = router;
