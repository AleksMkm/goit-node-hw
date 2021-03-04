const express = require('express');
const router = express.Router();

const usersController = require('../../../controllers/users-controller');
const validate = require('./validation');

router.post('/signup', validate.createUser, usersController.create);
router.post('/login', usersController.login);
router.post('/logout', usersController.logout);

module.exports = router;
