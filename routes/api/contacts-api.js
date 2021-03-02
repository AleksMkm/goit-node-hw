const express = require('express');
const router = express.Router();

const contactsController = require('../../controllers/contacts-controller');
const validate = require('./validation');

router
  .get('/', contactsController.getAll)
  .post('/', validate.createContact, contactsController.create);

router
  .get('/:id', contactsController.getById)
  .patch('/:id', validate.updateContactField, contactsController.update)
  .delete('/:id', contactsController.remove);

module.exports = router;
