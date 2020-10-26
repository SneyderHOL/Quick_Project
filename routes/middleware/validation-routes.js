const geolib = require('geolib');

function checkForRequired (req) {
  // check for vehicle
  if (validateString(req.body.vehicle.name)) {
    return errorTypeMessage();
  }
  // check for points
  if (req.body.points === undefined) return errorMissingMessage();
  if (!isArray(req.body.points)) return errorTypeMessage();
  if (req.body.points.length !== 2) return errorMissingMessage();
  if (Object.keys(req.body).length === 0) return errorMissingMessage();

  // validate where start
  if (validateObject(req.body.points[0])) {
    if (validateNumber(req.body.points[0].lat)) return errorTypeMessage();
    if (validateNumber(req.body.points[0].lng)) return errorTypeMessage();
    if (!geolib.isValidCoordinate([req.body.points[0].lat, req.body.points[0].lng])) {
      console.log('geo lib is falling');
      return errorTypeMessage();
    }
  }

  // validate the destination
  if (validateObject(req.body.points[1])) {
    if (validateNumber(req.body.points[1].lat)) return errorTypeMessage();
    if (validateNumber(req.body.points[1].lng)) return errorTypeMessage();
    if (!geolib.isValidCoordinate([req.body.points[1].lat, req.body.points[1].lng])) {
      console.log('geo lib is falling');
      return errorTypeMessage();
    }
  }

  // if (!validateObject(req.body.points[1]) || !validateObject(req.body.points[0])) {
  //   if (!validateString(req.body.points[0]) || !validateString(req.body.points[1])) {
  //     return errorTypeMessage();
  //   }
  // }

  return ok();
}

function errorMissingMessage () {
  return {
    status: true,
    message: 'Missing required values'
  };
}

function errorTypeMessage () {
  return {
    status: true,
    message: 'Wrong type'
  };
}

function ok () {
  return { status: false };
}

const isArray = (arr) => {
  return (!!arr) && (arr.constructor === Array);
};

const validateObject = (obj) => {
  return (!!obj) && (obj.constructor === Object);
};

/**
 * This function will check if theres is the type, if is not the type will be true
 * To further use this value and handle the error
 */
const validateString = (input) => {
  return (typeof (input) !== 'string');
};

function validateNumber (input) {
  if (typeof (input) !== 'number') {
    return true;
  }
  return false;
}

const validate = (req) => {
  // check for required properties
  if (!req.body.points || !req.body.vehicle) {
    return errorMissingMessage();
  }
  return checkForRequired(req);
};

exports.validateRoutes = async function (req, res, next) {
  // if (req.headers['content-type'] !== 'application/json') {
  // if (req.body === undefined || Object.keys(req.body).length === 0) {
  // if (req.body.id) { return badRes(res, 400); }
  // if (validWrongObj(req.body.points) || validWrongObj(req.body.vehicle)) {
  // if (Object.keys(req.body.points).length !== 2) { return badRes(res, 400); }
  // if (validWrongObj(req.body.points[0]) || validWrongObj(req.body.points[1])) {
  // if (!geolib.isValidCoordinate([req.body.points[0].lat, req.body.points[0].lng])) {
  // if (!geolib.isValidCoordinate([req.body.points[1].lat, req.body.points[1].lng])) {
  // if (Object.keys(req.body.vehicle).length < 1 || validWrongStr(req.body.vehicle.name)) {

  const validation = validate(req);
  if (validation.status) {
    const message = 'Input validation failed' + ' ' + validation.message;
    return res.status(400).send({ error: message });
  }

  next();
};
