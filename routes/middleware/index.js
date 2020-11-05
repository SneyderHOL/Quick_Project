const rateLimit = require('express-rate-limit');

/**
 * This is for make the main functions to the middleware
 * this function meauser the request per minute
 */
const limiterCrud = rateLimit({
  windowMs: 1 * 60 * 1000, // 100 request per 1 min
  max: 100,
  message: { error: 'Too many request' }
});

/**
 * This is for make the main functions to the middleware
 * this function meauser the request per minute
 */
const limiterRouting = rateLimit({
  windowMs: 1 * 60 * 1000, // 30 request per 1 min
  max: 30,
  message: { error: 'Too many request' }
});

module.exports = { limiterCrud, limiterRouting };
