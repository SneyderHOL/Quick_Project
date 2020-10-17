const requestAll = require('../services/routes-google').requestAll;
const redis = require('../app').redis;
// const validateRoute = require('./validationRoutes').validateRoutes;

// /api/tolls
exports.totalCosts = async (req, res, error) => {
  // const validation = validateRoute(req);
  // if (validation.status) {
  //   const message = 'Input validation failed' + ' ' + validation.message;
  //   return res.status(400).send({ error: message });
  // }
  const origin = req.body.points[0];
  const destination = req.body.points[1];
  const vehicleName = req.body.vehicle.name;

  let payload = null
  const key = origin.lat.toString() + origin.lng.toString() + destination.lat.toString() + destination.lng.toString();

  try {
    const cache = await redis.get(key);
    if (cache === null) {
      payload = await requestAll(origin, destination, vehicleName);
      if (payload === null) {
        return res.status(502).send({ error: 'Bad gateway' });
      }
      await redis.setex(key, 1440, JSON.stringify(payload));
    } else {
      payload = JSON.parse(cache);
    }
    return res.status(200).send(payload);

  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: 'There is a problem, try again' });
  }

};
