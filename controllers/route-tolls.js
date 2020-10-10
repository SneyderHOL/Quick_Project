const requestAll = require('../services/routes-google').requestAll;
const cost_tolls = require('../services/cost_tolls');
const {villavicencio, puerto_gaitan, cartagena} = require('../services/dummies-data');
// /api/tolls
exports.tollsInRoute = async (req, res, error) => {
  const origin = req.body.points[0];
  const destination = req.body.points[1];
  const vehicle = req.body.name;
  
  try {
    const tolls = await requestAll(origin, destination);
    const total = await cost_tolls.total(tolls, vehicle);
    res.status(200).send({"total": total});
  } catch(e){
      console.log(e);
      res.status(500).send({ error: 'There is a problem, try again' });
  }
};
