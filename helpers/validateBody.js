
const Joi = require('joi');

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.message });
  } else {
    next();
  }
};

module.exports = validateBody;

