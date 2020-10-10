const router = require('express').Router();
const controllerTolls = require('../controllers/tolls');

/**
 * validet this input using middle ware
*/
function inputValidation (req, res, next) {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400).send('Server requires application/json');
  }
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
