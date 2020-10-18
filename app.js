/**
 * Module dependencies.
 */
const debug = require('debug')('application:server');
const http = require('http');
const swaggerUI = require('swagger-ui-express');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const yaml = require('yamljs');
const Redis = require('ioredis');
const cors = require('cors');

require('dotenv').config();

// will use in the future
// const swaggerJSDocs = require('swagger-jsdoc');
const swaggerJS = yaml.load('./documentation.yaml');

const app = express();
app.use(cors());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJS));

app.use(logger('dev'));
app.use(express.json());

app.use(function (err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Handle the error here
    console.error('Bad JSON');
    res.status(400).send({ error: 'JSON parse error' });
  }
  // Pass the error to the next middleware if it wasn't a JSON parse error
  next(err);
});
app.use(express.urlencoded({ extended: false }));
const mongoDB = process.env.URL_DB;

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/**
 * Connect to reddis client localy
 */
const redis = new Redis(6379);
redis.on('connect', () => console.log('Connected to Redis'));
redis.on('error', (err) => console.error("Redis error encountered", err));

exports.redis = redis;

/**
 * Redirection
 */
app.get('/', function (req, res) {
  res.status(200).send('Welcome to the LaDificil API, If you need information please go to the /api-docs');
});

app.use('/api', require('./routes/index.js'));

/**
 * redirect 404 errors in ExpressJS
 */
app.use((req, res, next) => {
  res.status(404).send({ error: 'Not found. Please following this guide https://github.com/SneyderHOL/Quick_Project' });
  next();
});

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort (val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) return val;

  if (port >= 0) return port;

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError (error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening () {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = { app, mongoose };
