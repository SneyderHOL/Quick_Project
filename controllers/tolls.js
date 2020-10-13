const Toll = require('../models/tolls');

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
      res.status(404).send({ error: 'Not Found' });
      return;
    }
    res.status(200).send(toll);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.createToll = async (req, res) => {
  try {
    const newToll = new Toll();
    newToll.coordinates = req.body.coordinates;
    newToll.direction = req.body.direction;
    newToll.costs = req.body.costs;
    newToll.department = req.body.department;
    newToll.operator = req.body.operator;
    newToll.name = req.body.name;
    await Toll.createToll(newToll);
    res.status(201).send(newToll);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.deleteToll = async (req, res) => {
  try {
    const del = await Toll.deleteToll(req.params.id);

    if (del) {
      return res.status(204).send({ status: `${req.params.id} is deleted` });
    }

    return res.status(400).send({ status: 'The id provide not exist' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.updateToll = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ error: 'Bad Request, please send complete information' });
  }
  try {
    var toll = null;
    toll = await Toll.findTollById(req.params.id);
    if (!toll) {
      return res.status(404).send({ error: 'Not found' });
    }
    const updatedToll = await Toll.updateToll(req.params.id, req.body);
    return res.status(200).send(updatedToll);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};
