const requestAll = require('../services/routes-google').requestAll;
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

  // const key = origin.lat.toString() + origin.lng.toString() + destination.lat.toString() + destination.lng.toString();
  // let jsonData = null;
  try {
    const payload = await requestAll(origin, destination, vehicleName);

    if (payload === null) {
      console.log('if del payload');
      return res.status(502).send({ error: 'Bad gateway' });
    }
    return res.status(200).send(payload);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'There is a problem, try again' });
  }
};
