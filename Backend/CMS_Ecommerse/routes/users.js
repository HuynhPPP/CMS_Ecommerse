const express = require('express');
const UsersControllers = require('../controllers/users');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const router = express.Router();

// register: /api/users/register
router.post('/register', UsersControllers.register);

// login: /api/users/login
router.post('/login', UsersControllers.login);

// get users: /api/users/
router.get('/', verifyAdmin, UsersControllers.getUsers);

// get user by id: /api/users/:id
router.get('/:id', verifyToken, UsersControllers.getUserById);

// update user: /api/users/:id
router.put('/:id', verifyToken, UsersControllers.updateUser);

// delete user: /api/users/:id
router.delete('/:id', verifyAdmin, UsersControllers.deleteUser);

module.exports = router;
