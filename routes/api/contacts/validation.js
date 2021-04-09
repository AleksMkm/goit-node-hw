const Joi = require('joi');
const { HttpCode } = require('../../../helpers/constants');

const schemaCreateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  number: Joi.number().required(),
});

const schemaUpdateContactField = Joi.alternatives().try(
  Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    number: Joi.string(),
  }),
  Joi.object({
    name: Joi.string().alphanum().min(3).max(30),
    number: Joi.number().required(),
  }),
);

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Field ${message.replace(/"/g, '')}`,
    });
  }
  next();
};

module.exports.createContact = (req, _res, next) => {
  return validate(schemaCreateContact, req.body, next);
};

module.exports.updateContactField = (req, _res, next) => {
  return validate(schemaUpdateContactField, req.body, next);
};
