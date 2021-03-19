const express = require('express');
const router = express.Router();

const usersController = require('../../../controllers/users-controller');
const guard = require('../../../helpers/guard');
const upload = require('../../../helpers/upload');
const validate = require('./validation');

router.post('/signup', validate.createUser, usersController.create);
router.post('/login', usersController.login);
router.post('/logout', guard, usersController.logout);
router.get('/current', guard, usersController.current);
router.patch(
  '/sub',
  [guard, validate.updateSubscription],
  usersController.updateSubscription,
);
router.patch(
  '/avatar',
  [guard, upload.single('avatar'), validate.updateAvatar],
  usersController.updateAvatar,
);
router.get('/verify/:verificationToken', usersController.verifyEmail);

module.exports = router;
