const Joi = require('joi');

const schemaCreateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.number().required(),
});

// const schemaUpdateCat = Joi.object({
//   name: Joi.string().alphanum().min(3).max(30).optional(),
//   age: Joi.number().integer().min(1).max(45).optional(),
//   isVaccinated: Joi.boolean().optional(),
// });

// const schemaUpdateStatusCat = Joi.object({
//   isVaccinated: Joi.boolean().required(),
// });

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: 400,
      message: `Field ${message.replace(/"/g, '')}`,
    });
  }
  next();
};

module.exports.createContact = (req, res, next) => {
  return validate(schemaCreateContact, req.body, next);
};

// module.exports.updateCat = (req, res, next) => {
//   return validate(schemaUpdateCat, req.body, next);
// };

// module.exports.updateStatusCat = (req, res, next) => {
//   return validate(schemaUpdateStatusCat, req.body, next);
// };
