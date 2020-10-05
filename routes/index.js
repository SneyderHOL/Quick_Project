const express = require('express'); 
const router = express.Router();
const tollRouter = require('./tolls.js');
const statusRouter = require('./status.js');
const taxesRouter = require('./taxes.js');
const vehiclesRouter = require('./vehicles.js');
const tripRouter = require('./trip.js');


router.use('/tolls', tollRouter);
router.use('/status', statusRouter);
router.use('/taxes', taxesRouter);
router.use('/vehicles', vehiclesRouter);
router.use('/trip', tripRouter);

module.exports = router;