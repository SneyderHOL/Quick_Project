const requestAll = require('../services/routes-google').requestAll;

// /api/tolls
exports.tollsInRoute = (req, res, error) => {
  const origin = req.body.points[0];
  const destination = req.body.points[1];

  requestAll(origin, destination)
    .then(tolls => res.status(200).send({ tolls: tolls }))
    .catch(err => {
      console.log(err);
      res.status(500).send({ error: 'There is a problem, try again' }
      );
    });
};
