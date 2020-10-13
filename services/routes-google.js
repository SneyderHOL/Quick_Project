const fetch = require('node-fetch');
const keyGoogle = process.env.GOOGLE_API;
const keyOpenRoute = process.env.API_OPENROUTES;
const Toll = require('../models/tolls');
const costTolls = require('./cost_tolls');

function isValidToll (sectionDirection, toll) {
  if (toll.direction === 0 || toll.direction === sectionDirection.lat || toll.direction === sectionDirection.lng) {
    return true;
  }
  return false;
}

function tollsInSection (originPoint, destinationPoint, TotalTolls) {
  const tolls = TotalTolls;
  const sectionDirection = findDirection(originPoint, destinationPoint);
  const tollArray = [];
  const startLatitude = originPoint.lat;
  const endLatitude = destinationPoint.lat;
  
  for (const index in tolls) {
    let validToll = null;
    const tollLat = tolls[index].coordinates.lat;
    const tollLng = tolls[index].coordinates.lng;

    // North to South and West to East
    if (sectionDirection.lat === 1 && sectionDirection.lng === 4) {
      if (tollLat >= destinationPoint.lat && tollLat <= originPoint.lat) {
        if (tollLng >= originPoint.lng && tollLng <= destinationPoint.lng) {
          validToll = isValidToll(sectionDirection, tolls[index]);
        }
      }
    // North to South and East to West
    } else if (sectionDirection.lat === 1 && sectionDirection.lng === 3) {
      if (tollLat >= destinationPoint.lat && tollLat <= originPoint.lat) {
        if (tollLng >= destinationPoint.lng && tollLng <= originPoint.lng) {
          validToll = isValidToll(sectionDirection, tolls[index]);
        }
      }
    // South to North and West to East ->
    } else if (sectionDirection.lat === 2 && sectionDirection.lng === 4) {
      if (tollLat >= originPoint.lat && tollLat <= destinationPoint.lat) {
        if (tollLng >= originPoint.lng && tollLng <= destinationPoint.lng) {
          validToll = isValidToll(sectionDirection, tolls[index]);
        }
      }
    // South to North and East to West <-
    } else if (sectionDirection.lat === 2 && sectionDirection.lng === 3) {
      if (tollLat >= originPoint.lat && tollLat <= destinationPoint.lat) {
        if (tollLng >= destinationPoint.lng && tollLng <= originPoint.lng) {
          validToll = isValidToll(sectionDirection, tolls[index]);
        }
      }
    }
    /*
    if (validToll === false || validToll === true) {
      console.log('Peaje');
      console.log(tolls[index]);
      console.log('valor de valid: ', validToll);
      console.log('');
    }*/
    if (validToll) {
      tollArray.push(tolls[index]);
    }
  }
  return tollArray;
}

/**
 * find the Min, Max latitute and longitude
 */
function findSearchArea(sectionPoints) {
  let maxLatitude = sectionPoints[0][1];
  let minLatitude = maxLatitude;
  let maxLongitude = sectionPoints[0][0];
  let minLongitude = maxLongitude;
  let point = null;
  for (let i = 0; i < sectionPoints.length; i++) {
    point = sectionPoints[i];
    if (point[1] > maxLatitude) {
      maxLatitude = point[1];
    } else if (point[1] < minLatitude) {
      minLatitude = point[1];
    }
    if (point[0] > maxLongitude) {
      maxLongitude = point[0];
    } else if (point[0] < minLongitude) {
      minLongitude = point[0];
    }
  }
  const area = {
    lat: {
      min: minLatitude,
      max: maxLatitude
    },
    lng: {
      min: minLongitude,
      max: maxLongitude
    }
  };
  return area;
}

/**
 * find the Min, Max latitute and longitude
 */
function adjustSearchAreaPoints(areaPoints, originPoint, destinationPoint, sectionDirection) {
  if (sectionDirection.lat === 1) {
    originPoint.lat = areaPoints.lat.max;
    destinationPoint.lat = areaPoints.lat.min;
    if (sectionDirection.lng === 3) {
      originPoint.lng = areaPoints.lng.max;
      destinationPoint.lng = areaPoints.lng.min;
    } else {
      originPoint.lng = areaPoints.lng.min;
      destinationPoint.lng = areaPoints.lng.max;
    }
  } else {
    originPoint.lat = areaPoints.lat.min;
    destinationPoint.lat = areaPoints.lat.max;
    if (sectionDirection.lng === 3) {
      originPoint.lng = areaPoints.lng.max;
      destinationPoint.lng = areaPoints.lng.min;
    } else {
      originPoint.lng = areaPoints.lng.min;
      destinationPoint.lng = areaPoints.lng.max;
    }
  }
}
/**
 * find in a section (point a point b) a toll
 */
function findSection (steps) {
  const sections = [];
  for (const i in steps) {
    if (steps[i].html_instructions.includes('Toll')) {
      // console.log(steps[i].html_instructions)
      /* iterate throught the result of the road and return it */
      sections.push({
        distance: steps[i].distance.text,
        start_location: steps[i].start_location,
        end_location: steps[i].end_location
      });
    }
  }

  // fs.writeFile('test.txt', sections, 'utf8',(err) => console.error(err))
  // console.log(); //pantalla o archivo
  return sections;
}

/**
 * Find the direction of the route according to origin and destination
 */
function findDirection (origin, destination) {
  /* Directions:
    1- North - South
    2- South - North
    3- East - West
    4- West - East
  */
  const latitudeDirection = (origin.lat > destination.lat) ? 1 : 2;
  const longitudeDirection = (origin.lng > destination.lng) ? 3 : 4;

  return {
    lat: latitudeDirection,
    lng: longitudeDirection
  };
}

/**
 * Will check the tolls in the route with a merge
 */
function findTollInRoute (sectionPoints, originPoint, destinationPoint, TotalTolls) {
  const sectionDirection = findDirection(originPoint, destinationPoint);
  const searchAreaPoints = findSearchArea(sectionPoints);
  adjustSearchAreaPoints(searchAreaPoints, originPoint, destinationPoint, sectionDirection);
  // const sectionTolls = tollsInSection(originPoint, destinationPoint, TotalTolls);
  // console.log('area points: ', searchAreaPoints);
  // console.log('origin point: ', originPoint);
  // console.log('destination point: ', destinationPoint);
  const sectionTolls = tollsInSection(originPoint, destinationPoint, TotalTolls);
  /*
  console.log('Peajes encontrados en un tramo:');
  console.log(sectionTolls);
  console.log('\n\n');
  */
  const tollList = [];
  for (const toll in sectionTolls) {
    let ver = false;

    const auxLatitude = sectionTolls[toll].coordinates.lat;
    const auxString = auxLatitude.toString().split('.');
    //const tollLatitude = parseFloat(sectionTolls[toll].coordinates.lat.toString().slice(0, 5));
    const tollLatitude = parseFloat(auxString[0] + '.' + auxString[1].slice(0, 3));
    const tollLongitude = sectionTolls[toll].coordinates.lng;
    const errorFactor = 0.005;
    
    const searchRangeLatitudeMin = tollLatitude - errorFactor;
    const searchRangeLatitudeMax = tollLatitude + errorFactor;

    const searchRangeLongitudeMin = tollLongitude - errorFactor;
    const searchRangeLongitudeMax = tollLongitude + errorFactor;
    let index = -1;

    for (const i in sectionPoints) {
      if (sectionPoints[i][1] >= searchRangeLatitudeMin && sectionPoints[i][1] <= searchRangeLatitudeMax) {
        const pointLongitude = sectionPoints[i][0];
        if (pointLongitude <= searchRangeLongitudeMax && pointLongitude >= searchRangeLongitudeMin) {
          index = i;
          break;
        }
      }
    }
    if (index === -1) {
      continue;
    } else {
      //return sectionTolls[toll];
      tollList.push(sectionTolls[toll]);
    }
  }
  return tollList;
}

/**
 * Clean path from google API
 */
function cleanPathFunction(steps) {
  const path = [];
  for (let i = 0; i < steps.length; i++) {
    const points = {
      start: steps[i].start_location,
      end: steps[i].end_location,
    };
    path.push(points);
  }
  return path;
}

/**
 * Clean tolls array
 */
function cleanTollsFunction(tolls) {
  const tollsList = [];
  for (let i = 0; i < tolls.length; i++) {
    //console.log(tolls[i]);
    const toll = {
      coordinates: tolls[i].coordinates,
      name: tolls[i].name
    };
    tollsList.push(toll);
  }
  return tollsList;
}


/**
 * Will request to google direction api return a promise
 */
const requestRoutesAsync = async (origin, destination) => {
  const url = 'https://maps.googleapis.com/maps/api/directions/json?' +
  `origin=${origin.lat},${origin.lng}` +
  `&destination=${destination.lat},${destination.lng}` +
  `&key=${keyGoogle}`;

  const responseApi = await fetch(url);
  const responseData = await responseApi.json();
  return responseData.routes[0].legs[0];
};

/**
 * Will request to google direction api return a promise
 */
const requestAll = async (origin, destination, vehicleName) => {
  // reciba un tercer argumento/parametro
  // busqueda del vehicle en la bd -> objeto vehicle
  const dataGoogle = await requestRoutesAsync(origin, destination);
  const sections = findSection(dataGoogle.steps);
  let payload = null;
  let tollsCost = 0;
  const tolls = [];
  const TotalTolls = await Toll.getTolls();

  for (const section in sections) {
    const startSection = sections[section].start_location;
    const endSection = sections[section].end_location;
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car' +
      `?api_key=${keyOpenRoute}&start=${startSection.lng},${startSection.lat}` +
      `&end=${endSection.lng},${endSection.lat}`;
    const response = await fetch(url);
    const dataOpenRoute = await response.json();
    const dataPoints = dataOpenRoute.features[0].geometry.coordinates;
    const toll = findTollInRoute(dataPoints, startSection, endSection, TotalTolls);
    if (toll) {
      for (let element in toll) {
	tolls.push(toll[element]);
      }
    }
  }
  //console.log(tolls);
  // formular/armar el objeto de respuesta
  tollsCost = await costTolls.total(tolls, vehicleName)
  const cleanPath = cleanPathFunction(dataGoogle.steps);
  const cleanTolls = cleanTollsFunction(tolls);
  payload = {
    total_kms: dataGoogle.distance.value,
    duration: dataGoogle.duration.text,
    tolls: cleanTolls,
    path: cleanPath,
    toll_expenses: tollsCost
  };
  /*
  payload = {
    total_kms: dataGoogle.distance.value,
    duration: dataGoogle.duration.text,
    tolls: tolls,
    path: dataGoogle.steps,
    toll_expenses: tollsCost
  };
  */
  return payload;
};

module.exports = {
  requestAll
};
/*
function badRequest(response) {
  return response.status(400).send({error: 'Bad request'});
}

function inputValidationCreation(req, res) {
  if (req.body === null || req.body === undefined || req.body === {}) {
    return badRequest(res);
  }
  if (typeof(req.body.coordinates) !== 'object') {
    return badRequest(res);
  }
  if (validateNumber(req.body.coordinates.lat) || validateNumber(req.body.coordinates.lng)) {
    return badRequest(res);
  }
  if (validateNumber(direction)) {
    return badRequest(res);
  }
}

function inputValidationRead(req, res) {
  
}

function inputValidationUpdate(req, res) {
  if (req.body === null || req.body === undefined || req.body === {}) {
    return badRequest(res);
  }
  if (validateObject(req.body.coordinates)) {
    return badRequest(res);
  }
  if (validateNumber(req.body.coordinates.lat) || validateNumber(req.body.coordinates.lng)) {
    return badRequest(res);
  }
}

function inputValidationDelete(req, res) {
  
}

function validateObject(input) {
  if (typeof(input) !== 'object') {
    return true;
  }
  return false;
}

function validateString(input) {
  if (typeof(input) !== 'string') {
    return true;
  }
  return false;
}

function validateObject(input) {
  if (typeof(input) !== 'number') {
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
*//*
function orderTollList(tollList) {
  let aux = null;
  for (let i = 0; i < tollList.length; i++) {

  }

}
*/
