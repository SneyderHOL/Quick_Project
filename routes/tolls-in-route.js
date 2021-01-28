// const validateRoute = require('./validationRoutes').validateRoutes;
const router = require('express').Router();
const controlerTotal = require('../controllers/route-tolls');
const middleware = require('./middleware/validation-routes').validateRoutes;

//  router.post('/', controlerTotal.totalCosts);
router.post('/', middleware, controlerTotal.totalCosts);

module.exports = router;
