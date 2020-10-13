const geolib = require('geolib');

/**
function inputValidationRead(req, res) {}
function inputValidationUpdate(req, res) {
  if (req.body === null || req.body === undefined || req.body === {}) {
    return badRequest(res);
  }
  if (validWrongObj(req.body.coordinates)) {
    return badRequest(res);
  }
  if (validateNumber(req.body.coordinates.lat) || validateNumber(req.body.coordinates.lng)) {
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
  console.log(typeof(input));
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

exports.validateRoutes = function (req, res, next) {
  if (req.headers['content-type'] !== 'application/json')
    return res.status(400).send('Server requires application/json');
  console.log('1');
  if (req.body === undefined || Object.keys(req.body).length === 0)
    return badRes(res, 400);
  console.log('2');
  if (validWrongObj(req.body.coordinates) || validWrongObj(req.body.vehicle))
    return badRes(res, 422);
  console.log('3');
  if (Object.keys(req.body.coordinates).length === 2)
    return badRes(res, 400);
  console.log('4');
  if (validWrongObj(req.body.coordinates.start) || validWrongObj(req.body.coordinates.dest))
    return badRes(res, 422);
  console.log('5');
  if (!geolib.isValidCoordinate([ req.body.coordinates.start.lat, req.body.coordinates.start.lng ]))
    return badRes(res, 422);
  console.log('6');
  if (!geolib.isValidCoordinate([ req.body.coordinates.dest.lat, req.body.coordinates.dest.lng ]))
    return badRes(res, 422);
  console.log('7');
  if (Object.keys(req.body.vehicle).length >= 1 || validWrongStr(req.body.vehicle.name))
    return badRes(res, 422);

  next();
}
