const Toll = require('../models/tolls');

exports.getTolls = async (req, res) => {
  const tolls = { tolls: await Toll.getTolls()};
  res.status(200).send({ data: tolls });
};

exports.getTollById = async (req, res) => {
  try {
    try{
      var toll = await Toll.findTollById(req.params.id);
      res.status(200).send(toll);
    }
    catch(e){
      if (!toll) {
        res.status(404).send(`Toll with id ${req.params.id} not found`);
      } 
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.createToll = async (req, res) => {
  try {
    const newToll = new Toll();
    newToll.coordenates = req.body.coordenates;
    newToll.direction = req.body.direction;
    newToll.toll_cost = req.body.toll_cost;
    newToll.department = req.body.department;
    newToll.operator = req.body.operator;
    newToll.name = req.body.name;
    Toll.createToll(newToll);
    res.status(201).send(newToll);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteToll = async (req, res) => {
  try {
    await Toll.deleteToll(req.params.id);
    res.status(200).send(`${req.params.id} toll deleted`);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateToll = async (req, res) => {
  try {
    var toll = null
      try{
        toll = await Toll.findTollById(req.params.id);
        const updatedToll = await Toll.updateToll(req.params.id, req.body);
        res.status(200).send(updatedToll);
      } catch(e){
        if (!toll) {
          res.status(404).send(`Toll with id ${req.params.id} not found`);
        }
      }
  } catch (error) {
    res.status(500).send(error);
  }
};
