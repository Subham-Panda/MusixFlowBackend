const express = require('express');
const { validate } = require('express-validation');
const controller = require('./controller');
const {
  users,
  registerUser,
  connectWallet,
  disconnectWallet,
  wallet,
  loginUser,
  getProfilePayload,
  updateProfilePayload,
  deleteProfilePayload,
} = require('./validation');
const { authorize } = require('../../../middlewares/auth');

const routes = express.Router();

routes.route('/register').post(validate(registerUser, {}, {}), controller.register);

routes.route('/login').post(validate(loginUser, {}, {}), controller.login);

routes.route('/profile/get').post(validate(getProfilePayload), controller.getProfile);

routes.route('/profile/update').patch(validate(updateProfilePayload), controller.updateProfile);

routes.use(authorize());

// routes.route('/').get(validate(users), authorize(), controller.users);
routes.route('/').get(validate(users), controller.users);

routes.route('/profile/delete').delete(validate(deleteProfilePayload), controller.deleteProfile);

routes.route('/wallet').get(validate(wallet), controller.getWallet);

routes.route('/wallet/connect').post(validate(connectWallet), controller.connectWallet);

routes.route('/wallet/disconnect').post(validate(disconnectWallet), controller.disconnectWallet);

module.exports = routes;
