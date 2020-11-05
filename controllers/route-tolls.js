const requestAll = require('../services/routes-google').requestAll;

/**
 * This function is to calculate the total cost of a route,
 * this is the main fucntion
 * @param {req} object The parameter contains the content of the request to the API
 * @param {res} object The parameter contains the content of the response to the api
 * @param {error} object The parameter contains the error if there is a error in the
 * moment when the API fails
 */
exports.totalCosts = async (req, res, error) => {
  const origin = req.body.points[0];
  const destination = req.body.points[1];
  const vehicleName = req.body.vehicle.name;

  try {
    const payload = await requestAll(origin, destination, vehicleName);

    if (payload.error !== undefined) {
      const status = payload.status;
      delete payload.status;
      return res.status(status).send(payload);
    }

    return res.status(200).send(payload);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'There is a problem, try again' });
  }
};
