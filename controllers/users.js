const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadReqErr = require('../errors/bad-req-err');
const ConflictErr = require('../errors/conflict-err');
const NotFoundErr = require('../errors/not-found-err');
const UnAuthErr = require('../errors/un-auth-err');
const {
  SECRET_CODE, MES_NOT_FOUND_USER, MES_INVALID_DATA, MES_DUPLICATE_ERR, MES_AUTH_ERR, MES_TOKEN_DEL,
} = require('../utils/constants');

const signUp = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });

    await user.save();
    return res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    if (err.name === 'ValidationError') { return next(new BadReqErr(MES_INVALID_DATA)); }
    if (err.name === 'MongoError' && err.code === 11000) { return next(new ConflictErr(MES_DUPLICATE_ERR)); }
    return next(err);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) { return next(new UnAuthErr(MES_AUTH_ERR)); }

    const isPasswordConfirm = bcrypt.compareSync(password, user.password);

    if (!isPasswordConfirm) { return next(new UnAuthErr(MES_AUTH_ERR)); }

    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : SECRET_CODE, { expiresIn: '7d' });

    res.cookie('jwt', token, {
      maxAge: 10080000,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return res.send({ token });
  } catch (err) {
    return next(err);
  }
};

const signOut = async (req, res, next) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return res.send(MES_TOKEN_DEL);
  } catch (err) { return next(err); }
};

const getUserProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) { return next(new NotFoundErr(MES_NOT_FOUND_USER)); }

    return res.send(user);
  } catch (err) { return next(err); }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { email, name } = req.body;
    const user = await User.findByIdAndUpdate(_id, { email, name }, {
      new: true,
      runValidators: true,
    });
    if (!user) { return next(new NotFoundErr(MES_NOT_FOUND_USER)); }

    return res.send(user);
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) { return next(new ConflictErr(MES_DUPLICATE_ERR)); }
    if (err.name === 'ValidationError') { return next(new BadReqErr(MES_INVALID_DATA)); }
    return next(err);
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
  getUserProfile,
  updateUserProfile,
};
