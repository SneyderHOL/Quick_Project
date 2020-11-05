/**
 * This function is to validate if the parameters are good and if it is possible for
 * create a car
 * @param {req} object The parameter contains the content of the request to the API
 */
exports.validateCreation = (req) => {
  // check for required properties
  if (!req.body.name || !req.body.category || !req.body.typeOf || !req.body.weight || !req.body.axis || !req.body.fuel_type) {
    return errorMissingMessage();
  }
  return checkForRequired(req);
};

/**
 * This function if there is a wrong type in the object when it pass from the request
 * @param {req} object The parameter contains the content of the request to the API
 */
function checkForRequired (req) {
  // check for name
  if (validateString(req.body.name)) {
    return errorTypeMessage();
  }
  // check for category
  if (validateNumber(req.body.category.group1)) {
    return errorTypeMessage();
  }
  if (validateNumber(req.body.category.group2)) {
    return errorTypeMessage();
  }
  if (validateNumber(req.body.category.group3)) {
    return errorTypeMessage();
  }
  // check for typeOF
  if (validateString(req.body.typeOf)) {
    return errorTypeMessage();
  } else {
    if (req.body.typeOf !== 'automovil' && req.body.typeOf !== 'bus' && req.body.typeOf !== 'camion' && req.body.typeOf !== 'moto') {
      return errorValueMessage();
    }
  }
  // check for weight
  if (validateNumber(req.body.weight)) {
    return errorTypeMessage();
  }
  // check for axis
  if (validateNumber(req.body.axis)) {
    return errorTypeMessage();
  } else {
    if (req.body.axis > 10 || req.body.axis < 2) {
      return errorValueMessage();
    }
  }
  // check for fuel_type
  if (validateString(req.body.fuel_type)) {
    return errorTypeMessage();
  } else {
    if (req.body.fuel_type !== 'diesel' && req.body.fuel_type !== 'gas') {
      return errorValueMessage();
    }
  }
  // check for status
  if (req.body.status && validateBoolean(req.body.status)) {
    return errorTypeMessage();
  }
  // check for volume
  if (req.body.volume && validateNumber(req.body.volume)) {
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
 * This function return a message for error value when send a request to the API
 */
function errorValueMessage () {
  return {
    status: true,
    message: 'Wrong Value'
  };
}

/**
 * This function return a good status
 */
function ok () {
  return { status: false };
}

/**
 * This function if the vehicle information is true to update
 * @param {req} object The parameter contains the content of the request to the API
 */
exports.validateUpdate = (req) => {
  // check for optional properties
  return checkForOptional(req);
};

/**
 * This function if there is a wrong type in the object when it pass from the request
 * @param {req} object The parameter contains the content of the request to the API
 */
function checkForOptional (req) {
  // check for name
  if (req.body.name && validateString(req.body.name)) {
    return errorTypeMessage();
  }
  // check for category
  if (req.body.category) {
    if (!req.body.category.group1 && !req.body.category.group2 & !req.body.category.group3) {
      return errorTypeMessage();
    }
    if (req.body.category.group1 && validateNumber(req.body.category.group1)) {
      return errorTypeMessage();
    }
    if (req.body.category.group2 && validateNumber(req.body.category.group2)) {
      return errorTypeMessage();
    }
    if (req.body.category.group3 && validateNumber(req.body.category.group3)) {
      return errorTypeMessage();
    }
  }
  // check for typeOF
  if (req.body.typeOf) {
    if (validateString(req.body.typeOf)) {
      return errorTypeMessage();
    } else {
      if (req.body.typeOf !== 'automovil' && req.body.typeOf !== 'bus' && req.body.typeOf !== 'camion' && req.body.typeOf !== 'moto') {
        return errorValueMessage();
      }
    }
  }
  // check for weight
  if (req.body.weight && validateNumber(req.body.weight)) {
    return errorTypeMessage();
  }
  // check for axis
  if (req.body.axis) {
    if (validateNumber(req.body.axis)) {
      return errorTypeMessage();
    } else {
      if (req.body.axis > 10 || req.body.axis < 2) {
        return errorValueMessage();
      }
    }
  }
  // check for fuel_type
  if (req.body.fuel_type) {
    if (validateString(req.body.fuel_type)) {
      return errorTypeMessage();
    } else {
      if (req.body.fuel_type !== 'diesel' && req.body.fuel_type !== 'gas') {
        return errorValueMessage();
      }
    }
  }
  // check for status
  if (req.body.status && validateBoolean(req.body.status)) {
    return errorTypeMessage();
  }
  // check for volume
  if (req.body.volume && validateNumber(req.body.volume)) {
    return errorTypeMessage();
  }
  return ok();
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


/**
 * This function validate if the input is a boolean
 * @param {input} object The parameter contains any kind of input
 */
function validateBoolean (input) {
  if (typeof (input) !== 'boolean') {
    return true;
  }
  return false;
}
