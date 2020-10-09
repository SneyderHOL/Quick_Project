const router = require('express').Router();
const tollRouter = require('./tolls.js');
const tollsInRoute = require('./tolls-in-route.js');
const vehicle = require('./vehicles');

/**
 * Redirection
 */
router.get('/', function(req, res) {
  res.redirect('/api-docs');
});


router.use('/tolls', tollRouter);
router.use('/route/tolls', tollsInRoute);
router.use('/vehicle', vehicle);

module.exports = router;
