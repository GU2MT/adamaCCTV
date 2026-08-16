const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/usersController');
const authenticate = require('../middleware/authenticate');

router.post('/register', UsersController.registerUser);
router.post('/login', UsersController.loginUser);
router.get('/me', authenticate, UsersController.getCurrentUser);
router.post('/forgot-password', UsersController.forgotPassword);

module.exports = router;
