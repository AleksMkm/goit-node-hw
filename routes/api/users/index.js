const express = require('express');
const router = express.Router();

const usersController = require('../../../controllers/users-controller');
const guard = require('../../../helpers/guard');
const validate = require('./validation');

router.post('/signup', validate.createUser, usersController.create);
router.post('/login', usersController.login);
router.post('/logout', guard, usersController.logout);

module.exports = router;
