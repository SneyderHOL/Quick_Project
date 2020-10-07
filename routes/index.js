const router = require('express').Router();
const tollRouter = require('./tolls.js');
const tollsInRoute = require('./tolls-in-route.js');
const vehicle = require('./vehicles');

router.use('/tolls', tollRouter);
router.use('/route/tolls', tollsInRoute);
router.use('/vehicle', vehicle);

module.exports = router;
