const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
require('dotenv').config();

const Users = require('../model/users');
const { HttpCode, Status } = require('../helpers/constants');
const {
  downloadAvatarFromUrl,
  saveAvatarToStatic,
  deletePreviousAvatar,
} = require('../helpers/avatar-handler');
const EmailService = require('../services/email-verification');

const SECRET_KEY = process.env.JWT_SECRET;

async function create(req, res, next) {
  try {
    const { email, name } = req.body;

    const user = await Users.findByEmail(email);

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: Status.ERROR,
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email is already use',
      });
    }

    // creating verification token
    const verificationToken = uuid();

    // sending verification email
    const emailService = new EmailService(process.env.NODE_ENV);
    await emailService.sendVerificationEmail(verificationToken, email, name);

    // creating user in db
    const newUser = await Users.createUser({
      ...req.body,
      verified: false,
      verificationToken,
    });
    // fetching default avatar
    const { tmpPath, fileName } = await downloadAvatarFromUrl(newUser);
    // editing and saving avatar to static
    const newAvatarUrl = await saveAvatarToStatic(
      newUser.id,
      tmpPath,
      fileName,
    );
    // updating avatar url in db
    await Users.updateAvatarUrl(newUser.id, newAvatarUrl);

    return res.status(HttpCode.CREATED).json({
      status: Status.SUCCESS,
      code: HttpCode.CREATED,
      data: {
        user: {
          name: newUser.name,
          id: newUser.id,
          email: newUser.email,
          subscription: newUser.subscription,
          avatar: newAvatarUrl,
          verified: newUser.verified,
        },
      },
    });
  } catch (e) {
    next(e);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const user = await Users.findUserByVerificationToken(
      req.params.verificationToken,
    );

    if (user) {
      await Users.updateVerificationToken(user._id, true, null);
      const verifiedUser = await Users.findByEmail(user.email);

      return res.status(HttpCode.OK).json({
        status: Status.SUCCESS,
        code: HttpCode.OK,
        data: {
          user: verifiedUser,
        },
      });
    }

    return res.status(HttpCode.BAD_REQUEST).json({
      status: Status.ERROR,
      code: HttpCode.BAD_REQUEST,
      data: 'Bad request',
      message: 'Link is not valid',
    });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isPasswordValid = await user?.validPassword(password);

    if (!user || !isPasswordValid) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: Status.ERROR,
        code: HttpCode.UNAUTHORIZED,
        data: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });
    }

    if (!user.verified) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: Status.ERROR,
        code: HttpCode.UNAUTHORIZED,
        data: 'UNAUTHORIZED',
        message: 'User not verified',
      });
    }

    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await Users.updateToken(id, token);
    return res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        user: {
          name: user.name,
          id: user.id,
          email: user.email,
          subscription: user.subscription,
          avatar: user.avatarURL,
          verified: user.verified,
        },
        token,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function logout(req, res, next) {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (e) {
    next(e);
  }
}

async function current(req, res, next) {
  try {
    return res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        user: {
          name: req.user.name,
          id: req.user.id,
          email: req.user.email,
          subscription: req.user.subscription,
          avatar: req.user.avatarURL,
          verified: req.user.verified,
        },
      },
    });
  } catch (e) {
    next(e);
  }
}

async function updateSubscription(req, res, next) {
  try {
    const id = req.user.id;
    const subscription = req.body.subscription;
    await Users.updateSubscription(id, subscription);

    return res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        id: req.user.id,
        email: req.user.email,
        subscription,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function updateAvatar(req, res, next) {
  try {
    const id = req.user.id;
    const pathFile = req.file.path;
    const fileName = `${Date.now()}-${req.file.originalname}`;
    // editing and saving avatar to static
    const newAvatarUrl = await saveAvatarToStatic(id, pathFile, fileName);
    // updating avatar url in db
    await Users.updateAvatarUrl(id, newAvatarUrl);
    // deleting previous avatar to keep 1 avatar per user
    await deletePreviousAvatar(req.user.avatarURL);

    return res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: { newAvatarUrl },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  create,
  login,
  logout,
  current,
  updateSubscription,
  updateAvatar,
  verifyEmail,
};
