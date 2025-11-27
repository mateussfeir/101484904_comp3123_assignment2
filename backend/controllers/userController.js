const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SALT_ROUNDS = 10;

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '12h',
  });

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
});

// POST /api/v1/user/signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'User with provided email or username already exists.' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    res
      .status(201)
      .json({
        message: 'User created successfully.',
        token,
        user: sanitizeUser(newUser),
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/v1/user/login
exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { username }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'Invalid username/email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: 'Invalid username/email or password',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
