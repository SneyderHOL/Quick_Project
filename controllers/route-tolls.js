const requestAll = require('../services/routes-google').requestAll;
//const costTolls = require('../services/cost_tolls');
// const { villavicencio, puerto_gaitan, cartagena } = require('../dummies-data');
// /api/tolls
exports.tollsInRoute = async (req, res, error) => {
  const origin = req.body.points[0];
  const destination = req.body.points[1];
  // enviar un tercer parametro
  const vehicleName = req.body.vehicle.name;
  // busqueda del vehicle en la bd -> objeto vehicle
  try {
    const payload = await requestAll(origin, destination, vehicleName);
    //const total = await costTolls.total(tolls, vehicle);
    //console.log(total);
    return res.status(200).send(payload);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: 'There is a problem, try again' });
  }
};
