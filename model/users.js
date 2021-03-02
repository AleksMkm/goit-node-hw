const User = require('./schemas/user');

async function createUser(body) {
  const result = await User.create(body);
  return result;
}

module.exports = {
  createUser,
};
