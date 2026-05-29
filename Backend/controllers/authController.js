const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { readData, writeData } = require("../services/fileService");
const { JWT_SECRET } = require("../middleware/authMiddleware");

async function register(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Username, email and password are required."
        });
    }

    const users = readData("users.json");

    const existingUser = users.find(x => x.email === email);

    if (existingUser) {
        return res.status(400).json({
            message: "User with this email already exists."
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
        id: uuidv4(),
        username,
        email,
        passwordHash,
        role: users.length === 0 ? "admin" : "user",
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeData("users.json", users);

    res.status(201).json({
        message: "User registered successfully.",
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        }
    });
}

async function login(req, res) {
    const { email, password } = req.body;

    const users = readData("users.json");
    const user = users.find(x => x.email === email);

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password."
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password."
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: "2h"
        }
    );

    res.json({
        message: "Login successful.",
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}

module.exports = {
    register,
    login
};