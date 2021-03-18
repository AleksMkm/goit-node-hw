const bcrypt = require('bcryptjs');

const { users } = require('./data');

const createUser = jest.fn(({ email, password, subscription = 'free' }) => {
  const pass = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  const newUser = {
    email,
    password: pass,
    subscription,
    _id: '604780b0a33f593b5866d7ad',
    avatarURL:
      'https://s.gravatar.com/avatar/6394dd3083e8711e2bc44e947d726258?s=250',
    verified: false,
    verificationToken: null,
    validPassword: function (pass) {
      return bcrypt.compareSync(pass, this.password);
    },
  };
  users.push(newUser);
  return newUser;
});

const findByEmail = jest.fn(email => {
  const [user] = users.filter(el => String(el.email) === String(email));
  return user;
});

const findById = jest.fn(id => {
  const [user] = users.filter(el => String(el._id) === String(id));
  return user;
});

const findUserByVerificationToken = jest.fn(verificationToken => {
  const [user] = users.filter(
    el => String(el.verificationToken) === String(verificationToken),
  );
  return user;
});

const updateVerificationToken = jest.fn((id, verified, verificationToken) => {
  const [user] = users.filter(el => String(el._id) === String(id));
  user.verified = verified;
  user.verificationToken = verificationToken;
});

const updateToken = jest.fn((id, token) => {
  return {};
});

const updateSubscription = jest.fn((id, subscription) => {
  return subscription;
});

const updateAvatarUrl = jest.fn((id, url) => {
  return {};
});

module.exports = {
  createUser,
  findByEmail,
  updateToken,
  findById,
  updateSubscription,
  updateAvatarUrl,
  findUserByVerificationToken,
  updateVerificationToken,
};
