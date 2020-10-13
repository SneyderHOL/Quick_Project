const router = require('express').Router();
const controllerTollsInRoute = require('../controllers/route-tolls');



router.post('/', controllerTollsInRoute.tollsInRoute);

module.exports = router;
