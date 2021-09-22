const jwt = require('jsonwebtoken');
const UnAuthErr = require('../errors/un-auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;
const { SECRET_CODE } = require('../utils/constants');

module.exports = async (req, res, next) => {
  console.log(req.cookies.jwt);
  try {
    const token = req.cookies.jwt;
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : SECRET_CODE);
    console.log(payload);
    console.log(req.user);
    req.user = payload;
    return next();
  } catch (err) { return next(new UnAuthErr('Необходимо авторизоваться')); }
};
