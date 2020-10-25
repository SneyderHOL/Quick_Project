const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');
const redisConection = process.env.REDIS_DB || 6379;

// conection to a redis cloud
const redis = new Redis(redisConection);
redis.on('connect', () => console.log('Connected to Redis for auth'));
redis.on('error', (err) => console.error('Redis error encountered', err));

/**
 * This is for authentification
 * @param {req} req is for request the params of the body,
 * query and params url
 * @param {res} res is an object to manage the response the
*/
exports.createToken = async (req, res) => {
  if (req.body.key === undefined || req.body.name === undefined ||
      req.body.key !== process.env.MASTER_KEY) {
    return res.status(400).send({ error: 'Error with your validation' });
  }

  const key = uuidv4();
  const datetime = new Date();
  const value = req.body.name + '-' + datetime.toISOString().slice(0, 10);
  const r = await redis.set(key, value);

  if (r === 'OK') {
    return res.status(200).send({ key: key, status: 'SUCCESS', date: datetime });
  }

  return res.status(400).send({ key: null, status: 'Something wrong, try again' });
};

/**
 * This is for authentification
 * @param {req} req is for request the params of the body,
 * query and params url
 * @param {res} res is an object to manage the response the
*/
exports.validateAuth = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ message: 'No token provided.' });

  const validate = await redis.get(token);
  if (validate === null) return res.status(401).send({ message: 'Wrong token' });

  next();
};

/**
 * This is for authentification
 * @param {req} req is for request the params of the body,
 * query and params url
 * @param {res} res is an object to manage the response the
*/
exports.bringingAllkeys = async (req, res) => {
  if (req.body.key !== process.env.MASTER_KEY) {
    return res.status(400).send({ error: 'Error with your validation' });
  }

  return res.status(200).send({ data: await redis.keys('*') });
};

/**
 * This is for authentification
 * @param {req} req is for request the params of the body,
 * query and params url
 * @param {res} res is an object to manage the response the
*/
exports.deleteToken = async (req, res) => {
  if (req.body.key !== process.env.MASTER_KEY || req.body.token === undefined) {
    return res.status(400).send({ error: 'Error with your validation' });
  }
  const validate = await redis.get(req.body.token);
  if (validate === null) return res.status(401).send({ message: 'Wrong token' });

  await redis.del(req.body.token);
  return res.status(200).send({ status: 'delete token' });
};
