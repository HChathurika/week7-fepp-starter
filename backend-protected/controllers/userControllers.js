const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "3d",
  });
};

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const signupUser = async (req, res) => {
  const {
    name,
    email,
    password,
    phone_number,
    gender,
    date_of_birth,
    membership_status,
  } = req.body;

  try {
    if (
      !name ||
      !email ||
      !password ||
      !phone_number ||
      !gender ||
      !date_of_birth ||
      !membership_status
    ) {
      throw new Error("Please add all fields");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone_number,
      gender,
      date_of_birth,      // string from form; mongoose will cast to Date
      membership_status,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error("Please add all fields");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for user email
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      res.status(200).json({ email: user.email, token });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getMe,
};
