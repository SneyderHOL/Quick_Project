const router = require('express').Router();
const controllerTolls = require('../controllers/tolls');

/**
 * validet this input using middle ware
*/
function validatePost (req, res, next) {
  if (req.get('content-type') !== 'application/json') {
    return res.status(400).send({error: 'Server requires application/json'});
  }
  // the object.keys is for test how long is the object
  if (Object.keys(req.body).length === 0 || req.body.coordinates === undefined
    || req.body.name === undefined) {
    return res.status(400).send({
      error: 'Send the complete information, missing coordinates or the name of toll'
    });
  }

  // the object.keys is for test how long is the object
  if (Object.keys(req.body.costs).length === 0) {
    return res.status(400).send({ error: 'Please give costs of tolls' });
  }

  next();
}

router.get('/', controllerTolls.getTolls);
router.post('/', validatePost, controllerTolls.createToll);
router.get('/:id', controllerTolls.getTollById);
router.patch('/:id', controllerTolls.updateToll);
router.delete('/:id', controllerTolls.deleteToll);

module.exports = router;
