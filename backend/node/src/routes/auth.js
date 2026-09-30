const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config");

const router = express.Router();

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function signToken(user) {
  return jwt.sign({ userId: user._id, email: user.email }, config.jwtSecret, {
    expiresIn: "7d",
  });
}

router.post("/register", async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long." });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ error: "Email already registered." });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: normalizedEmail, passwordHash });
    const token = signToken(user);

    res.cookie("token", token, getCookieOptions());
    return res.status(201).json({ email: user.email });
  } catch (error) {
    console.error("Registration failed:", error.message);
    return res.status(500).json({ error: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.comparePassword(normalizedEmail, password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signToken(user);
  res.cookie("token", token, getCookieOptions());
  return res.json({ email: user.email });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({});
});

router.get("/me", async (req, res) => {
  if (!req.user) {
    return res.json({ user: null });
  }

  const user = await User.findById(req.user.userId).lean();
  return res.json({
    email: user?.email || req.user.email,
    emailOptIn: user?.emailOptIn ?? true,
  });
});

router.post("/email-opt-in", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Login required" });
  }

  const { emailOptIn } = req.body || {};
  if (typeof emailOptIn !== "boolean") {
    return res.status(400).json({ error: "emailOptIn must be a boolean." });
  }

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { emailOptIn },
    { new: true, runValidators: true },
  );

  return res.json({ email: user.email, emailOptIn: user.emailOptIn });
});

module.exports = router;
