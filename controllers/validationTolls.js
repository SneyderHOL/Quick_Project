exports.validateCreation = (req) => {
  // check for required properties
  if (!req.body.name || !req.body.coordinates || !req.body.costs) {
    return errorMissingMessage();
  }
  return checkForRequired(req);
};

function checkForRequired (req) {
  let moreCosts = false;
  // check for name
  if (validateString(req.body.name)) {
    return errorTypeMessage();
  }
  // check for coordinates
  if (validateNumber(req.body.coordinates.lat)) {
    return errorTypeMessage();
  }
  if (validateNumber(req.body.coordinates.lng)) {
    return errorTypeMessage();
  }
  // check for direction
  if (req.body.direction) {
    if (!validateNumber(req.body.direction)) {
      if (req.body.direction > 4 || req.body.direction < 0) {
        return errorValueMessage();
      }
    } else {
      return errorTypeMessage();
    }
  }
  // check for status
  if (req.body.status && validateBoolean(req.body.status)) {
    return errorTypeMessage();
  }
  // check for costs
  if (req.body.group) {
    if (!validateNumber(req.body.group)) {
      if (req.body.group > 3 || req.body.group < 1) {
        return errorValueMessage();
      } else {
        moreCosts = true;
      }
    } else {
      return errorTypeMessage();
    }
  }
  if (validateNumber(req.body.costs.I)) {
    return errorTypeMessage();
  }
  if (validateNumber(req.body.costs.II)) {
    return errorTypeMessage();
  }
  if (validateNumber(req.body.costs.III)) {
    return errorTypeMessage();
  }
  if (moreCosts && req.body.group >= 2) {
    if (validateNumber(req.body.costs.IV)) {
      return errorTypeMessage();
    }
    if (validateNumber(req.body.costs.V)) {
      return errorTypeMessage();
    }
  }
  if (moreCosts && req.body.group >= 3) {
    if (validateNumber(req.body.costs.VI)) {
      return errorTypeMessage();
    }
    if (validateNumber(req.body.costs.VII)) {
      return errorTypeMessage();
    }
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

exports.validateUpdate = (req) => {
  // check for optional properties
  return checkForOptional(req);
};

function checkForOptional (req) {
  // check for operator
  if (req.body.operator && validateString(req.body.operator)) {
    return errorTypeMessage();
  }
  // check for name
  if (req.body.name && validateString(req.body.name)) {
    return errorTypeMessage();
  }
  // check for department
  if (req.body.department && validateString(req.body.department)) {
    return errorTypeMessage();
  }
  // check for status
  if (req.body.status && validateBoolean(req.body.status)) {
    return errorTypeMessage();
  }
  // check for direction
  if (req.body.direction) {
    if (!validateNumber(req.body.direction)) {
      if (req.body.direction > 4 || req.body.direction < 0) {
        return errorValueMessage();
      }
    } else {
      return errorTypeMessage();
    }
  }
  // check for coordinates
  if (req.body.coordinates) {
    if (req.body.coordinates.lat || req.body.coordinates.lng) {
      if (req.body.coordinates.lat && validateNumber(req.body.coordinates.lat)) {
        return errorTypeMessage();
      }
      if (req.body.coordinates.lng && validateNumber(req.body.coordinates.lng)) {
        return errorTypeMessage();
      }
    } else {
      return errorTypeMessage();
    }
  }
  // check for group
  if (req.body.group) {
    if (!validateNumber(req.body.group)) {
      if (req.body.group > 3 || req.body.group < 1) {
        return errorValueMessage();
      } else {
        if (req.body.group === 0) {
          return errorValueMessage();
        }
      }
    } else {
      return errorTypeMessage();
    }
  }
  // check for costs
  if (req.body.costs) {
    if (req.body.costs.I && validateNumber(req.body.costs.I)) {
      return errorTypeMessage();
    }
    if (req.body.costs.II && validateNumber(req.body.costs.II)) {
      return errorTypeMessage();
    }
    if (req.body.costs.III && validateNumber(req.body.costs.III)) {
      return errorTypeMessage();
    }
    if (req.body.costs.IV && validateNumber(req.body.costs.IV)) {
      return errorTypeMessage();
    }
    if (req.body.costs.V && validateNumber(req.body.costs.V)) {
      return errorTypeMessage();
    }
    if (req.body.costs.VI && validateNumber(req.body.costs.VI)) {
      return errorTypeMessage();
    }
    if (req.body.costs.VII && validateNumber(req.body.costs.VII)) {
      return errorTypeMessage();
    }
    if (!req.body.costs.I && !req.body.costs.II && !req.body.costs.III && !req.body.costs.IV && !req.body.costs.V && !req.body.costs.VI && !req.body.costs.VII) {
      return errorTypeMessage();
    }
  }
  return ok();
}
/*
function validateObject(input) {
  if (typeof(input) !== 'object') {
    return true;
  }
  return false;
}
*/
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
