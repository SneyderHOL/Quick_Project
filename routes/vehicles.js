const router = require('express').Router();
const controllerVehicles = require('../controllers/vehicles');

router.get('/', controllerVehicles.getVehicles);

router.post('/', controllerVehicles.createVehicles);

// end points to manage the cost of the vehicles
router.patch('/features/:id', controllerVehicles.updateFeaturesById);
router.patch('/features', controllerVehicles.updateTheWholeFeature);
// keep the delete in the endpoint or change the method and just keep /features/:id
router.delete('/features/:id', controllerVehicles.deleteFeaturesForVehicle);

// verificar esa id
// devolver que no encontro nada
router.get('/:id', controllerVehicles.findVehicleById);

router.patch('/:id', controllerVehicles.updateVehicles);

router.delete('/:id', controllerVehicles.deleteVehicles);

module.exports = router;
