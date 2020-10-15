const Vehicles = require('../models/vehicles');

exports.getVehicles = async (req, res) => {
  try {
    const vehicles = { vehicles: await Vehicles.findAllVehicles() };
    res.status(200).send(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.createVehicles = async (req, res) => {
  try {
    const newVehicle = new Vehicles();
    newVehicle.name = req.body.name;
    newVehicle.state = req.body.state;
    newVehicle.features = req.body.features;
    newVehicle.axis = req.body.axis;
    newVehicle.volume = req.body.volume;
    newVehicle.weight = req.body.weight;
    newVehicle.fuel_type = req.body.fuel_type;
    newVehicle.category = req.body.category;
    await Vehicles.create(newVehicle);
    res.status(201).send(newVehicle);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
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

exports.updateVehicles = async (req, res) => {
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
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.deleteVehicles = async (req, res) => {
  try {
    var vehicle = await Vehicles.findVehicleById(req.params.id);
    if (!vehicle) {
      res.status(404).send({ error: 'Vehicle Not Found' });
      return;
    }
    res.status(200).send({ status: 'The vehicle was deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
