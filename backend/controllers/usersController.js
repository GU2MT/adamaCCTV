const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const JWT_SECRET = process.env.JWT_SECRET || 'adama-cctv-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const normalizeRole = (roleId) => {
  const numericRoleId = Number(roleId || 3);
  if (numericRoleId === 1) return 'Administrator';
  if (numericRoleId === 2) return 'Police';
  return 'Citizen';
};
const createTokenForUser = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role_id: user.role_id,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const normalizeUserPayload = (user) => ({
  id: user.user_id || user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  gender: user.gender,
  phone: user.phone || user.phone_number,
  email: user.email,
  address: user.address,
  role_id: user.role_id || 3,
  role: normalizeRole(user.role_id || 3),
});
const registerUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      gender,
      phone,
      email,
      password,
      confirmPassword,
      address,
      role_id,
    } = req.body;

    const trimmedFirstName = (first_name || '').trim();
    const trimmedPhone = (phone || '').trim();
    const trimmedEmail = (email || '').trim().toLowerCase();

    if (!trimmedFirstName || !trimmedPhone || !trimmedEmail || !password) {
      return res.status(400).json({ error: 'first_name, phone, email, and password are required' });
    }

    if (!['male', 'female'].includes((gender || '').toLowerCase())) {
      return res.status(400).json({ error: 'Gender must be Male or Female' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existingByPhone = await Users.findUserByPhone(trimmedPhone);
    if (existingByPhone) {
      return res.status(409).json({ error: 'User with this phone already exists' });
    }

    const existingByEmail = await Users.findUserByEmail(trimmedEmail);
    if (existingByEmail) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
   const user = await Users.createUser({
  first_name: trimmedFirstName,
  last_name: (last_name || '').trim(),
  gender,
  phone: trimmedPhone,
  email: trimmedEmail,
  password_hash: hashedPassword,
  address: (address || '').trim(),
  role_id: 3,
});
    const token = createTokenForUser(user);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: normalizeUserPayload(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const trimmedIdentifier = (identifier || '').trim();

    if (!trimmedIdentifier || !password) {
      return res.status(400).json({ error: 'identifier and password are required' });
    }

    const user = await Users.findUserByIdentifier(trimmedIdentifier);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email/phone or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email/phone or password' });
    }

    const token = createTokenForUser(user);
    res.json({
      message: 'Login successful',
      token,
      user: normalizeUserPayload(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await Users.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: normalizeUserPayload(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await Users.findUserByEmail(normalizedEmail);
    if (user) {
      console.log(`Password recovery requested for ${normalizedEmail}`);
      // In production, send a secure reset link to the user's email here.
    }

    res.json({
      message: 'If an account exists for that email, recovery instructions have been sent.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
};

