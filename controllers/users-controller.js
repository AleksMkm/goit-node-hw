const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');

const create = async (req, res, next) => {
  try {
    const user = await Users.createUser(req.body);
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user,
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  create,
};
