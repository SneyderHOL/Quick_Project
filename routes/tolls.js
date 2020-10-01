const express = require('express');
const router = express.Router();
const controllerTolls = require('../controllers/tolls');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/tolls', controllerTolls.getTolls);
router.post('/tolls', controllerTolls.createToll);
router.get('/tolls/:id', controllerTolls.getTollById);
router.patch('/tolls/:id', controllerTolls.updateToll);
router.delete('/tolls/:id', controllerTolls.deleteToll);
module.exports = router;
