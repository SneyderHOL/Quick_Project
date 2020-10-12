const requestAll = require('../services/routes-google').requestAll;
// const costTolls = require('../services/cost_tolls');
// const { villavicencio, puerto_gaitan, cartagena } = require('../dummies-data');
// /api/tolls
exports.tollsInRoute = async (req, res, error) => {
  const origin = req.body.points[0];
  const destination = req.body.points[1];
  // const vehicle = req.body.name;

  try {
    const tolls = await requestAll(origin, destination);
    // const total = await costTolls.total(tolls, vehicle);
    return res.status(200).send({ total: tolls });
  } catch (e) {
    return res.status(500).send({ error: 'There is a problem, try again' });
  }
};
