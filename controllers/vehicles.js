const Vehicles = require('../models/vehicles');

exports.getVehicles = (req, res) => {
  Vehicles.findAllVehicles()
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal error, try again');
    });
};

exports.createVehicles = (req, res) => {
  Vehicles.create({ ...req.body })
    .then(data => res.status(201).send({ vehicle: data, status: 'Success' }))
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal error, try again');
    });
};

exports.getVehiclesByFeatures = async (req, res) => {
  Vehicles.findBySpecification(req.params.axis)
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal error, try again');
    });
};

exports.findVehicleById = async (req, res) => {
  Vehicles.findVehicleById(req.params.id)
    .then(vehicle => {
      res.status(200).send(vehicle);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal error, try again');
    });
};

exports.updateVehicles = async (req, res) => {
  Vehicles.findVehicleById(req.params.id)
    .then(() => {
      Vehicles.updateVehicles(req.params.id, { ...req.body })
        .then(v => res.status(200).send(v))
        .catch(err => {
          console.error(err);
          res.status(500).send('Internal error, try again');
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal error, try again');
    });
};

exports.deleteVehicles = async (req, res) => {
  Vehicles.deleteVehicle(req.params.id)
    .then(() => res.status(203).send('The vehicle is delete success'))
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal error, try again');
    });
};
