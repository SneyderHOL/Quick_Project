/**
 * This function is to validate with others functios if the request is valid, works
 * like a middlware
 * @param {req} object The parameter contains the content of the request to the API
*/
exports.validateRoutes = (req) => {
  // check for required properties
  if (!req.body.points || !req.body.vehicle) {
    return errorMissingMessage();
  }
  return checkForRequired(req);
};

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
  if (validateObject(req.body.points[0])) {
    return errorTypeMessage();
  }
  if (validateObject(req.body.points[1])) {
    return errorTypeMessage();
  }
  if (validateNumber(req.body.points[0].lat)) {
    return errorTypeMessage();
  }
  if (validateNumber(req.body.points[0].lng)) {
    return errorTypeMessage();
  }
  if (validateNumber(req.body.points[1].lat)) {
    return errorTypeMessage();
  }
  if (validateNumber(req.body.points[1].lng)) {
    return errorTypeMessage();
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
 * This function validate if the input is a object
 * @param {input} object The parameter contains any kind of input
 */
function validateObject (input) {
  if (typeof (input) !== 'object') {
    return true;
  }
  return false;
}

/**
 * This function validate if the input is a string
 * @param {input} object The parameter contains any kind of input
 */
function validateString (input) {
  if (typeof (input) !== 'string') {
    return true;
  }
  return false;
}

/**
 * This function validate if the input is a number
 * @param {input} object The parameter contains any kind of input
 */
function validateNumber (input) {
  if (typeof (input) !== 'number') {
    return true;
  }
  return false;
}
