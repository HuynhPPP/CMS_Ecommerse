const express = require('express');
const UsersControllers = require('../controllers/users');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const userValidator = require('../middlewares/userValidator');
const router = express.Router();

const { authLimiter } = require('../middlewares/rateLimiter');

// register: /api/users/register
router.post('/register', authLimiter, userValidator.validateRegister, UsersControllers.register);

// login: /api/users/login
router.post('/login', authLimiter, userValidator.validateLogin, UsersControllers.login);

// get users: /api/users/
router.get('/', verifyAdmin, UsersControllers.getUsers);

// get user by id: /api/users/:id
router.get('/:id', verifyToken, userValidator.validateId, UsersControllers.getUserById);

// update user: /api/users/:id
router.put('/:id', verifyToken, userValidator.validateUpdate, UsersControllers.updateUser);

// delete user: /api/users/:id
router.delete('/:id', verifyAdmin, userValidator.validateId, UsersControllers.deleteUser);

module.exports = router;
