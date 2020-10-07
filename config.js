const dotenv = require('dotenv');
dotenv.config();

/**
 * This is for manage enviroment variables
 */
module.exports = {
  keyGoogle: process.env.GOOGLE_API,
  userDb: process.env.USER_DB,
  passwdDb: process.env.PASSWORD_DB,
  dbName: process.env.DB_NAME,
  keyOpenRoute: process.env.API_OPENROUTES
};
