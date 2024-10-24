const Joi = require("joi");

const authSchema = Joi.object({
  roleId:Joi.number(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});

module.exports = authSchema;
