const httpStatus = require('http-status');
// const uuidv4 = require('uuid');
const { v4: uuidv4 } = require('uuid');
const User = require('./model');
const { keysToCamel } = require('../../../utils/snake');

exports.users = async (req, res, next) => {
  try {
    const {
      user,
      query: {
        companyId, userId,
      },
    } = req;

    let query = {};

    if (companyId) {
      query = { company_id: companyId };
    } else if (userId) {
      query = { _id: userId };
    } else {
      query = {
        _id: { $nin: user._id },
        role: { $ne: 'admin' },
      };
    }

    const options = {
      _id: 1,
      company_id: 1,
      email: 1,
      first_name: 1,
      is_verified: 1,
      last_name: 1,
      phone: 1,
      photo: 1,
      role: 1,
      status: 1,
    };

    let users = await User.find(query, options);

    if (users.length > 0 && userId) {
      const [singleUser] = users;

      users = keysToCamel(singleUser.toObject());
    } else {
      users = users.map((singleUser) => keysToCamel(singleUser.toObject()));
    }

    return res.status(httpStatus.OK).json(users);
  } catch (error) {
    return next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    let {
      body: {
        // eslint-disable-next-line prefer-const
        firebaseUserId, name, phone, refreshToken,
      },
    } = req;

    phone = phone.split(' ').join('');

    const existingUser = await User.findOne({ $or: [{ firebase_user_id: firebaseUserId }, { phone }] });

    if (existingUser) {
      return res.status(httpStatus.CONFLICT).json({
        code: httpStatus.CONFLICT,
        message: 'User is already exist with that "firebaseUserId" Or "phone"',
        status: false,
      });
    }

    const user = await new User({
      firebase_user_id: firebaseUserId,
      name,
      phone,
      refresh_token: refreshToken,
    }).save();

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      data: { user },
      message: 'User registered successfully',
      status: true,
    });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    let { body: { phone } } = req;

    phone = phone.split(' ').join('');

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(httpStatus.CONFLICT).json({
        code: httpStatus.CONFLICT,
        message: 'User not found with given "phone"',
        status: false,
      });
    }

    const refreshToken = uuidv4() + user._id;
    const newToken = user.token(refreshToken);

    await User.updateOne({ _id: user._id }, { $set: { access_token: newToken } });
    user.access_token = newToken;

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      data: { user },
      message: 'User loggedIn successfully',
      status: true,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getWallet = async (req, res, next) => {
  try {
    const { user } = req;

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      data: { walletId: user.wallet_id },
      message: 'Wallet details',
      status: true,
    });
  } catch (error) {
    return next(error);
  }
};

exports.connectWallet = async (req, res, next) => {
  try {
    const {
      user,
      body: { walletId },
    } = req;

    await User.updateOne({ _id: user._id }, { $set: { wallet_id: walletId } });

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Wallet connected successfully',
      status: true,
    });
  } catch (error) {
    return next(error);
  }
};

exports.disconnectWallet = async (req, res, next) => {
  try {
    const { user } = req;

    await User.updateOne({ _id: user._id }, { $set: { wallet_id: null } });

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Wallet disconnected successfully',
      status: true,
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (req.user) {
      const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true, runValidators: true,
      });

      if (!updatedUser) {
        return res.status(httpStatus.NOT_FOUND).json({
          code: httpStatus.NOT_FOUND,
          message: 'No document found with the given user id',
        });
      }

      return res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        message: 'User updated Successfully',
        updatedUser,
      });
    }

    return res.status(httpStatus.UNAUTHORIZED).json({
      code: httpStatus.UNAUTHORIZED,
      message: 'User must be logged in',
    });
  } catch (error) {
    return next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({
          code: httpStatus.NOT_FOUND,
          message: 'No document found with the given user id',
        });
      }

      return res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        message: 'User Found',
        user,
      });
    }

    return res.status(httpStatus.UNAUTHORIZED).json({
      code: httpStatus.UNAUTHORIZED,
      message: 'User must be logged in',
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findByIdAndUpdate(req.user._id, { status: 'deleted' }, { new: true });

      if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({
          code: httpStatus.NOT_FOUND,
          message: 'No document found with the given user id',
        });
      }

      return res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        message: 'User Status set to deleted',
        user,
      });
    }

    return res.status(httpStatus.UNAUTHORIZED).json({
      code: httpStatus.UNAUTHORIZED,
      message: 'User must be logged in',
    });
  } catch (error) {
    return next(error);
  }
};
