const mongoose = require('mongoose');
const {
  mongo, env,
} = require('./config');

// Exit application on error
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (env === 'development') {
  mongoose.set('debug', false);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
  mongoose.connect(mongo.uri, {
    keepAlive: 1,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, () => {});

  return mongoose.connection;
};
