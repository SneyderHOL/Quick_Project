const requestAll = require('../services/routes-google').requestAll;

// /api/tolls
exports.totalCosts = async (req, res, error) => {
  const origin = req.body.points[0];
  const destination = req.body.points[1];
  const vehicleName = req.body.vehicle.name;
  try {
    const payload = await requestAll(origin, destination, vehicleName);

    if (payload === null) {
      return res.status(502).send({ error: 'Bad gateway' });
    }

    return res.status(200).send(payload);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'There is a problem, try again' });
  }
};
