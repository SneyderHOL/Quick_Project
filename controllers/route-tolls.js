const requestAll = require('../services/routes-google').requestAll;
const validateRoute = require('./validationRoutes').validateRoutes;
const redis = require('redis');

// /api/tolls
exports.totalCosts = async (req, res, error) => {
  let isActiveRedis = true;
  const validation = validateRoute(req);
  if (validation.status) {
    const message = 'Input validation failed' + ' ' + validation.message;
    return res.status(400).send({ error: message });
  }
  const origin = req.body.points[0];
  const destination = req.body.points[1];
  const vehicleName = req.body.vehicle.name;

  const key = origin.lat.toString() + origin.lng.toString() + destination.lat.toString() + destination.lng.toString();  
  
  console.log('Creating redis client');
  const client = redis.createClient(6379);
  client.on("error", (error) => {
    console.error(error);
    isActiveRedis = false;
  });
  try {
    if (isActiveRedis) {
      console.log('Client redis OK');
      client.get(key, async (err, data) => {
	if (data) {
	  const jsonData = JSON.parse(data);
	  return res.status(200).send(jsonData);
	}
      });
    }
    const payload = await requestAll(origin, destination, vehicleName);

    if (payload === null) {
      return res.status(502).send({ error: 'Bad gateway' });
    }
    if (isActiveRedis) {
      client.setex(key, 1440, JSON.stringify(payload));
    }
    return res.status(200).send(payload);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'There is a problem, try again' });
  }
};
