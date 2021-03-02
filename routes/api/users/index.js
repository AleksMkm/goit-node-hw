const express = require('express');
const router = express.Router();

const usersController = require('../../../controllers/users-controller');
const validate = require('./validation');

router.post('/signup', validate.createUser, usersController.create);
router.post('/login', usersController.login);

// router
//   .get('/:id', contactsController.getById)
//   .patch('/:id', validate.updateContactField, contactsController.update)
//   .delete('/:id', contactsController.remove);

module.exports = router;
