const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const NotAuthError = require('../utils/NotAuthError');
const { NODE_ENV_DEV } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NotAuthError('Необходима авторизация'));
  }
  let payload;
  const token = authorization.replace('Bearer ', '');

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : NODE_ENV_DEV);
  } catch (err) {
    next(new NotAuthError('Необходима авторизация!'));
  }

  req.user = payload;
  next();
};
