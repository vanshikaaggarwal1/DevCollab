const bcrypt = require("bcryptjs");
const User = require("../models/User");

const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.Password;
  return userObj;
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        statuscode: 0,
        message: "Please provide name, email, and password.",
      });
    }

    const existingUser = await User.findOne({ Email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        statuscode: 0,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      Name: name,
      Email: email.toLowerCase(),
      Password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      statuscode: 1,
      message: "Signup successful",
      user: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500).json({
      statuscode: 0,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        statuscode: 0,
        message: "Please provide email and password.",
      });
    }

    const user = await User.findOne({ Email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        statuscode: 0,
        message: "User not found.",
      });
    }

    let isMatch = false;
    if (user.Password) {
      isMatch = await bcrypt.compare(password, user.Password);
      // Fallback for legacy plain text passwords in local development
      if (!isMatch && user.Password === password) {
        isMatch = true;
        user.Password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!isMatch) {
      return res.status(400).json({
        statuscode: 0,
        message: "Wrong Password.",
      });
    }

    res.json({
      statuscode: 1,
      message: "Login successful",
      user: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500).json({
      statuscode: 0,
      message: "Server Error",
    });
  }
};

module.exports = { signup, login };