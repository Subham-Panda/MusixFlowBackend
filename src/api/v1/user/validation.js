const { Joi } = require('express-validation');

const headers = {
  headers: Joi.object({
    authorization: Joi.string()
      .trim()
      .required()
      .label('Auth Token'),
  }).options({ allowUnknown: true }),
};

module.exports = {

  // POST /v1/user/wallet/connect
  connectWallet: {
    ...headers,
    body: Joi.object({ walletId: Joi.string().required() }),
  },

  // POST /v1/user/wallet/disconnect
  disconnectWallet: {
    ...headers,
    body: Joi.object({}),
  },

  // POST /v1/user/get_wallet
  getWalletId: {
    ...headers,
    body: Joi.object({ firebaseUserId: Joi.string().required() }),
  },

  // POST /v1/user/login
  loginUser: {
    // ...headers,
    body: Joi.object({
      phone: Joi.string().required(),
      // refreshToken: Joi.string().required(),
    }),
  },

  // POST /v1/user/register
  registerUser: {
    ...headers,
    body: Joi.object({
      firebaseUserId: Joi.string().required(),
      name: Joi.string().optional(),
      phone: Joi.string().required(),
      refreshToken: Joi.string().required(),
    }),
  },

  // POST /v1/user/update_wallet
  updateWalletId: {
    ...headers,
    body: Joi.object({
      firebaseUserId: Joi.string().required(),
      walletId: Joi.string().required(),
    }),
  },

  // GET /v1/user
  users: { ...headers },

  // GET /v1/user/wallet
  wallet: {
    ...headers,
    query: Joi.object({}),
  },

};
