const express = require('express');
const router = express.Router();
const controllerTolls = require('../controllers/tolls');

router.get('/', controllerTolls.getTolls);
router.post('/', controllerTolls.createToll);
router.get('/:id', controllerTolls.getTollById);
router.patch('/:id', controllerTolls.updateToll);
router.delete('/:id', controllerTolls.deleteToll);
module.exports = router;
