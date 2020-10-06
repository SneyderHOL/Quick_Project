const router = require('express').Router();
const tollRouter = require('./tolls.js');
const tollsInRoute = require('./tolls-in-route.js')


router.use('/tolls', tollRouter);
router.use('/route/tolls', tollsInRoute);

module.exports = router;
