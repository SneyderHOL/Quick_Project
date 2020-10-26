const Vehicles = require('../models/vehicles');
const validateCreation = require('./validationVehicles').validateCreation;
const validateUpdate = require('./validationVehicles').validateUpdate;

exports.getVehicles = async (req, res) => {
  try {
    const vehicles = { vehicles: await Vehicles.findAllVehicles() };
    res.status(200).send(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.findVehicleById = async (req, res) => {
  try {
    var vehicle = await Vehicles.findVehicleById(req.params.id);
    if (!vehicle) {
      res.status(404).send({ error: 'Vehicle Not Found' });
      return;
    }
    res.status(200).send(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.createVehicles = async (req, res) => {
  // use of middleware validation for creation
  const validation = validateCreation(req);
  if (validation.status) {
    const message = 'Input validation failed' + ' ' + validation.message;
    return res.status(400).send({ error: message });
  }
  try {
    const newVehicle = new Vehicles();
    newVehicle.name = req.body.name;
    newVehicle.typeOf = req.body.typeOf;
    newVehicle.state = req.body.state;
    newVehicle.features = req.body.features;
    newVehicle.axis = req.body.axis;
    newVehicle.volume = req.body.volume;
    newVehicle.weight = req.body.weight;
    newVehicle.fuel_type = req.body.fuel_type;
    newVehicle.category = req.body.category;
    const createdVehicle = await Vehicles.create(newVehicle);
    res.status(201).send(createdVehicle);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.deleteVehicles = async (req, res) => {
  // console.log('A eliminar');
  try {
    const vehicle = await Vehicles.deleteVehicle(req.params.id);
    if (vehicle) {
      return res.status(200).send({ status: 'The vehicle was deleted successfully' });
    }

    return res.status(404).send({ error: 'Vehicle Not Found' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.getVehiclesByFeatures = async (req, res) => {
  try {
    var vehicle = await Vehicles.findBySpecification(req.params.axis);
    if (!vehicle) {
      res.status(404).send({ error: 'Vehicle Not Found' });
      return;
    }
    res.status(200).send(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.updateVehicles = async (req, res) => {
  // use of middleware validation for update
  const validation = validateUpdate(req);
  if (validation.status) {
    const message = 'Input validation failed' + ' ' + validation.message;
    return res.status(400).send({ error: message });
  }
  try {
    let vehicle = null;
    vehicle = await Vehicles.findVehicleById(req.params.id);
    if (!vehicle) {
      res.status(404).send({ error: 'Vehicle Not Found' });
      return;
    }
    const updatedVehicle = await Vehicles.updateVehicles(req.params.id, req.body);
    return res.status(200).send(updatedVehicle);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.deleteFeaturesForVehicle = async (req, res) => {
  try {
    let vehicle = null;
    vehicle = await Vehicles.findVehicleById(req.params.id);
    if (!vehicle) {
      res.status(404).send({ error: 'Vehicle Not Found' });
      return;
    }
    const updatedVehicle = await Vehicles.deleteFeaturesById(req.params.id, req.body);
    if (updatedVehicle === null) {
      return res.status(400).send({ error: 'The vehicle it cant update' });
    }
    return res.status(202).send(updatedVehicle);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.updateTheWholeFeature = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ error: 'Input validation failed' });
  }
  try {
    const updatedVehicle = await Vehicles.updateWholeVehicles(req.body);
    return res.status(202).send({ state: `Update succes ${updatedVehicle.n} of vehicles` });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.updateFeaturesById = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ error: 'Input validation failed' });
  }
  const vehicle = await Vehicles.findVehicleById(req.params.id);
  if (!vehicle) return res.status(404).send({ error: 'Vehicle Not Found' });

  try {
    const updatedVehicle = await Vehicles.updateFeaturesByid(req.params.id, req.body);
    if (updatedVehicle === null) {
      return res.status(401).send({ error: 'The vehicle it cant update' });
    }
    return res.status(202).send({ state: 'Update succes values' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};
