const Toll = require('../models/tolls');
const validateCreation = require('./validationTolls').validateCreation;
const validateUpdate = require('./validationTolls').validateUpdate;

exports.getTolls = async (req, res) => {
  try {
    const tolls = { tolls: await Toll.getTolls() };
    res.status(200).send({ data: tolls });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.getTollById = async (req, res) => {
  try {
    var toll = await Toll.findTollById(req.params.id);
    if (!toll) {
      res.status(404).send({ error: 'Toll Not Found' });
      return;
    }
    res.status(200).send(toll);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.createToll = async (req, res) => {
  const validation = validateCreation(req);
  if (validation.status) {
    const message = 'Input validation failed' + ' ' + validation.message;
    return res.status(400).send({ error: message });
  }
  try {
    const newToll = new Toll();
    newToll.coordinates = req.body.coordinates;
    if (req.body.direction) {
      newToll.direction = parseInt(req.body.direction, 10);
    }
    if (req.body.group) {
      newToll.group = parseInt(req.body.group, 10);
    }
    newToll.costs = req.body.costs;
    newToll.department = req.body.department;
    newToll.operator = req.body.operator;
    newToll.name = req.body.name;
    const createdToll = await Toll.createToll(newToll);
    res.status(201).send(createdToll);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.deleteToll = async (req, res) => {
  try {
    const toll = await Toll.deleteToll(req.params.id);
    if (toll) {
      return res.status(200).send({ status: 'The Toll was deleted successfully' });
    }

    return res.status(404).send({ error: 'Toll Not Found' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.updateToll = async (req, res) => {
  if (req.body.group === 0) {
    return res.status(400).send({ error: 'Input validation failed Wrong value' });
  }
  const validation = validateUpdate(req);
  if (validation.status) {
    const message = 'Input validation failed' + ' ' + validation.message;
    return res.status(400).send({ error: message });
  }
  try {
    let toll = null;
    toll = await Toll.findTollById(req.params.id);
    if (!toll) {
      return res.status(404).send({ error: 'Toll Not found' });
    }
    const updatedToll = await Toll.updateToll(req.params.id, req.body);
    return res.status(200).send(updatedToll);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};
