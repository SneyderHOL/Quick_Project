const requestAll = require('../services/routes-google').requestAll;
//const costTolls = require('../services/cost_tolls');
// const { villavicencio, puerto_gaitan, cartagena } = require('../dummies-data');
// /api/tolls
exports.totalCosts = async (req, res, error) => {
  const origin = req.body.points[0];
  const destination = req.body.points[1];
  // enviar un tercer parametro
  const vehicleName = req.body.vehicle.name;
  // busqueda del vehicle en la bd -> objeto vehicle
  try {
    const payload = await requestAll(origin, destination, vehicleName);
    //const total = await costTolls.total(tolls, vehicle);

    if (payload === null)
      return res.status(502).send({ error: "Bad gateway" });

    return res.status(200).send(payload);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: "There is a problem, try again" });
  }
};
