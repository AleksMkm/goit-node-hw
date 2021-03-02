const User = require('./schemas/user');

async function createUser(body) {
  const user = await User.create(body);
  return user;
}

async function findByEmail(email) {
  const user = await User.findOne({ email });
  return user;
}

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

module.exports = {
  createUser,
  findByEmail,
  updateToken,
};
