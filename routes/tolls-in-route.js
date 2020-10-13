const router = require('express').Router();
const controllerTollsInRoute = require('../controllers/route-tolls');
const middleware = require('./middleware/val-route').validateRoutes;


router.post('/', middleware, controllerTollsInRoute.totalCosts);

module.exports = router;
