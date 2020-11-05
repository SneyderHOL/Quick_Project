const router = require('express').Router();
const auth = require('./middleware/token').validateAuth;
const authenticated = require('./authenticated');
const limiter = require('./middleware/index');
const vehicle = require('./vehicles');
const tollRouter = require('./tolls.js');
const tollsInRoute = require('./tolls-in-route.js');

router.use('/tolls', limiter.limiterCrud, auth, tollRouter);
router.use('/routes/tolls', limiter.limiterRouting, auth, tollsInRoute);
router.use('/vehicles', limiter.limiterCrud, auth, vehicle);

// private endpoint
router.use('/tokens', autheknticated);

/**
 * This function is for the init of the API
 * @param {req} object The parameter contains the content of the request to the API
 */
router.get('/', function (req, res) {
  res.status(200).send({ status: 'Welcome to SmartRout Rest API, if you need information please go to the /api-docs' });
});

module.exports = router;
