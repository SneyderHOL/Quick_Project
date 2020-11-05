const geolib = require('geolib');

/**
 * This function is to validate all possibles parameters the client sent to the API and
 * avoid errors in the typing
 * @param {req} object The parameter contains the content of the request to the API
 */
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

  if (validateObject(req.body.points[1])) {
    if (validateNumber(req.body.points[1].lat)) return errorTypeMessage();
    if (validateNumber(req.body.points[1].lng)) return errorTypeMessage();
    if (!geolib.isValidCoordinate([req.body.points[1].lat, req.body.points[1].lng])) {
      console.log('geo lib is falling');
      return errorTypeMessage();
    }
  }

  return ok();
}

/**
 * This function return a message for missing values in the API response
 */
function errorMissingMessage () {
  return {
    status: true,
    message: 'Missing required values'
  };
}

/**
 * This function return a message for error type when send a request to the API
 */
function errorTypeMessage () {
  return {
    status: true,
    message: 'Wrong type'
  };
}

/**
 * This function return a good status
 */
function ok () {
  return { status: false };
}

/**
 * This function validate if the input is an array
 * @param {arr} object The parameter contains any kind of input
 */
const isArray = (arr) => {
  return (!!arr) && (arr.constructor === Array);
};

/**
 * This function validate if the input is a object
 * @param {input} object The parameter contains any kind of input
 */
const validateObject = (obj) => {
  return (!!obj) && (obj.constructor === Object);
};

/**
 * This function validate if the input is a string
 * @param {input} object The parameter contains any kind of input
 */
const validateString = (input) => {
  return (typeof (input) !== 'string');
};

/**
 * This function validate if is valid the number
 * @param {number} object The parameter contains any kind of input
 */
function validateNumber (input) {
  if (typeof (input) !== 'number') {
    return true;
  }
  return false;
}

/**
 * This function manage the message will send
 * @param {req} object The parameter contains any kind of input
 */
const validate = (req) => {
  // check for required properties
  if (!req.body.points || !req.body.vehicle) {
    return errorMissingMessage();
  }
  return checkForRequired(req);
};

/**
 * This function is to validate the message of the request to send it
 * @param {req} object The parameter contains the content of the request to the API
 * @param {res} object The parameter contains the content of the response to the API
 * @param {next} object The parameter to pass the argument
 */
exports.validateRoutes = async function (req, res, next) {
  const validation = validate(req);
  if (validation.status) {
    const message = 'Input validation failed' + ' ' + validation.message;
    return res.status(400).send({ error: message });
  }

  next();
};
