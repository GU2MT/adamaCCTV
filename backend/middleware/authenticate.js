const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const JWT_SECRET = process.env.JWT_SECRET || 'adama-cctv-secret';

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await Users.findUserById(payload.user_id);

    if (!user) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

   req.user = {
  id: user.user_id,
  user_id: user.user_id,
  email: user.email,
  first_name: user.first_name,
  last_name: user.last_name,
  role_id: user.role_id,
};
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authenticate;
