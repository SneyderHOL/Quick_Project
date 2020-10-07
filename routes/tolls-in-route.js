const router = require('express').Router();
const controllerTollsInRoute = require('../controllers/route-tolls');

/**
 * validet this input using middle ware
*/
function inputValidation (req, res, next) {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400).send('Server requires application/json');
  }
  if (req.body === {} || req.body.points === undefined || req.body.points.length !== 2) {
    res.status(400).send({ error: 'Send the complete information' });
  }
  if (req.body.points[0] === {} || req.body.points[1] === {}) {
    res.status(400).send({ error: 'Fill the data of the latitud and longitud' });
  }
  if (typeof (req.body.points[0].lat) === typeof (1.1) || typeof (req.body.points[0].lat) === typeof (1.1)) {
    res.status(400).send({ error: 'Fill the data of the origin with long types' });
  }
  if (typeof (req.body.points[1].lng) === typeof (1.1) || typeof (req.body.points[1].lng) === typeof (1.1)) {
    res.status(400).send({ error: 'Fill the data of the destination with long types' });
  }

  next();
}

router.get('/', inputValidation, controllerTollsInRoute.tollsInRoute);

module.exports = router;
