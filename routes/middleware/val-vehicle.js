const geolib = require('geolib');
// const Vehicle = require('../../models/vehicles')
/**
function inputValidationRead(req, res) {}
function inputValidationUpdate(req, res) {
  if (req.body === null || req.body === undefined || req.body === {}) {
    return badRequest(res);
  }
  if (validWrongObj(req.body.points)) {
    return badRequest(res);
  }
  if (validateNumber(req.body.points.lat) || validateNumber(req.body.points.lng)) {
    return badRequest(res);
  }
}
function inputValidationDelete(req, res) {}
function validWrongObj(input) {
  if (typeof(input) !== 'object') {
    return true;
  }
  return false;
}
function validateBoolean(input) {
  if (typeof(input) !== 'boolean') {
    return true;
  }
  return false;
}
function inputValidationCreation(req, res) {}
*/


/**
 * This function will check if theres is the type, if is not the type will be true
 * To further use this value and handle the error
 */
const validWrongObj = (input) => {
  return (typeof(input) !== 'object') ? true : false;
}
/**
 * This function will check if theres is the type, if is not the type will be true
 * To further use this value and handle the error
 */
const validWrongStr = (input) => {
  return (typeof(input) !== 'string') ? true : false;
}

const badRes = (response, status) => {
  return response.status(status).send({error: 'Bad request'});
}

exports.validateRoutes = async function (req, res, next) {
  if (req.headers['content-type'] !== 'application/json')
    return res.status(400).send('Server requires application/json');

  if (req.body === undefined || Object.keys(req.body).length === 0)
    return badRes(res, 400);

  if (validWrongObj(req.body.points) || validWrongObj(req.body.vehicle))
    return badRes(res, 422);

  if (Object.keys(req.body.points).length !== 2)
    return badRes(res, 400);

  if (validWrongObj(req.body.points[0]) || validWrongObj(req.body.points[1]))
    return badRes(res, 422);

  // validate where start
  if (!geolib.isValidCoordinate([ req.body.points[0].lat, req.body.points[0].lng ]))
    return badRes(res, 422);

  // validate the destination
  if (!geolib.isValidCoordinate([ req.body.points[1].lat, req.body.points[1].lng ]))
    return badRes(res, 422);

  if (Object.keys(req.body.vehicle).length < 1 || validWrongStr(req.body.vehicle.name))
    return badRes(res, 422);

  // checkear if the location is in Colombia

  next();
}
