const User = require('./schemas/user');

async function createUser(body) {
  return await User.create(body);
}

async function findByEmail(email) {
  return await User.findOne({ email });
}

async function findById(id) {
  return await User.findOne({ _id: id });
}

async function updateToken(id, token) {
  return await User.updateOne({ _id: id }, { token });
}

async function updateSubscription(id, subscription) {
  return await User.updateOne({ _id: id }, { subscription });
}

async function updateAvatarUrl(id, url) {
  return await User.updateOne({ _id: id }, { avatarURL: url });
}

async function findUserByVerificationToken(verificationToken) {
  return await User.findOne({ verificationToken });
}

async function updateVerificationToken(id, verified, verificationToken) {
  return await User.findOneAndUpdate(
    { _id: id },
    { verified, verificationToken },
  );
}

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
