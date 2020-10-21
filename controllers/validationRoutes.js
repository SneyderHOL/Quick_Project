exports.validateRoutes = (req) => {
  // check for required properties
  if (!req.body.points || !req.body.vehicle) {
    return errorMissingMessage();
  }
  return checkForRequired(req);
};

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

function errorValueMessage () {
  return {
    status: true,
    message: 'Wrong Value'
  };
}
function ok () {
  return { status: false };
}

function validateObject (input) {
  if (typeof (input) !== 'object') {
    return true;
  }
  return false;
}

function validateString (input) {
  if (typeof (input) !== 'string') {
    return true;
  }
  return false;
}

function validateNumber (input) {
  if (typeof (input) !== 'number') {
    return true;
  }
  return false;
}

function validateBoolean (input) {
  if (typeof (input) !== 'boolean') {
    return true;
  }
  return false;
}
