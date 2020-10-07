const dotenv = require('dotenv');
dotenv.config();

/**
 * This is for manage enviroment variables
 */
module.exports = {
  keyGoogle: process.env.GOOGLE_API,
  nameDb: process.env.USER,
  passwdDb: process.env.PASSWORD_DB,
  dbName: process.env.DB_NAME,
  keyOpenRoute: process.env.API_OPENROUTES
};
