const express = require("express")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/user");

const usersRouter = express.Router();

function checkValidSignup(username, password) {
    return username.length >= 3 && password.length >= 3;
}


usersRouter.get("/", async (req, res, next) => {
    try {
        const users = await User.find({}).populate("blogs", {title: 1, author: 1, url: 1});
        res.json(users);
    }
    catch(e) {
        next(e);
    }
})
usersRouter.post("/", async (req, res, next) => {
    try {
        const {username, name, password} = req.body;
        if (!checkValidSignup(username, password)) {
            return res.status(400).json({
                error: "Username or password invalid. Username and password must be at least 3 characters"
            })
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        const user = new User({
            username: username,
            name: name,
            passwordHash: passwordHash
        })
        const savedUser = await user.save();

        return res.status(201).json(savedUser);
    }
    catch(e) {
        next(e);
    }
})

module.exports = usersRouter