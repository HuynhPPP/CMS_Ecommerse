const express = require('express');
const UsersControllers = require('../controllers/users');
const router = express.Router();

// get users
router.get('/api/users', UsersControllers.getUsers);

// get user by id
router.get('/api/users/:id', UsersControllers.getUserById);

// update user
router.put('/api/users/:id', UsersControllers.updateUser);

// delete user
router.delete('/api/users/:id', UsersControllers.deleteUser);

module.exports = router;
