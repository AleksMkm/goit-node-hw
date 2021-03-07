const express = require('express');
const router = express.Router();

const contactsController = require('../../../controllers/contacts-controller');
const guard = require('../../../helpers/guard');
const validate = require('./validation');

router
  .get('/', guard, contactsController.getAll)
  .post('/', guard, validate.createContact, contactsController.create);

router
  .get('/:id', guard, contactsController.getById)
  .patch('/:id', guard, validate.updateContactField, contactsController.update)
  .delete('/:id', guard, contactsController.remove);

module.exports = router;
