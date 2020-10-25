const router = require('express').Router();
const tollRouter = require('./tolls.js');
const tollsInRoute = require('./tolls-in-route.js');
const vehicle = require('./vehicles');

router.use('/tolls', tollRouter);
router.use('/routes/tolls', tollsInRoute);
router.use('/vehicles', vehicle);

module.exports = router;
