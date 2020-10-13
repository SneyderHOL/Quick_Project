const router = require('express').Router();
const tollRouter = require('./tolls.js');
const tollsInRoute = require('./tolls-in-route.js');
const vehicle = require('./vehicles');

router.use('/tolls', tollRouter);
router.use('/routes/tolls', tollsInRoute);
router.use('/vehicles', vehicle);

// keep in the last because is the last route the app it will search
/**
 * Redirection to the documentation for the endpoint /api/
 */
router.use('/', (_, res) => res.redirect('/api-docs'));

// keep in the last because is the last route the app it will search
/**
 * Redirection to the documentation for the endpoint /api/
 */
router.use('/', (_, res) => res.redirect('/api-docs'));

module.exports = router;
