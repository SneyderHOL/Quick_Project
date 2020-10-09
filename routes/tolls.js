const router = require('express').Router();
const controllerTolls = require('../controllers/tolls');

/**
 * validet this input using middle ware
*/
function inputValidation (req, res, next) {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400).send('Server requires application/json');
  }
  // if (req.body === {} || req.body.points === undefined || req.body.points.length !== 2) {
  //   res.status(400).send({ error: 'Send the complete information' })
  // }
  // if (req.body.points[0] === {} || req.body.points[1] === {}) {
  //   res.status(400).send({ error: 'Fill the data of the latitud and longitud' })
  // }
  // if (typeof(req.body.points[0].lat) === typeof(1.1) || typeof(req.body.points[0].lat) === typeof(1.1)) {
  //   res.status(400).send({ error: 'Fill the data of the origin with long types' })
  // }
  // if (typeof(req.body.points[1].lng) === typeof(1.1) || typeof(req.body.points[1].lng) === typeof(1.1)) {
  //   res.status(400).send({ error: 'Fill the data of the destination with long types' })
  // }
  if (req.body === {} || req.body.points === undefined) {
    res.status(400).send({ error: 'Send the complete information' });
  }
  if (req.body.co === {} || req.body.points === undefined) {
    res.status(400).send({ error: 'Send the complete information' });
  }

  next();
}

router.get('/', controllerTolls.getTolls);
router.post('/', inputValidation, controllerTolls.createToll);
router.get('/:id', controllerTolls.getTollById);
router.patch('/:id', controllerTolls.updateToll);
router.delete('/:id', controllerTolls.deleteToll);

module.exports = router;
