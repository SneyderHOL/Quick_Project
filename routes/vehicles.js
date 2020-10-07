const router = require('express').Router();
const controllerVehicles = require('../controllers/vehicles');

router.get('/', controllerVehicles.getVehicles);
// validar que reciva un numero
router.get('find/:axis', controllerVehicles.getVehiclesByFeatures);
// verificar esa id
router.get('/:id', controllerVehicles.findVehicleById);

router.post('/', controllerVehicles.createVehicles);
// verificar esa id
router.patch('/:id', controllerVehicles.updateVehicles);

router.delete('/:id', controllerVehicles.deleteVehicles);

module.exports = router;
