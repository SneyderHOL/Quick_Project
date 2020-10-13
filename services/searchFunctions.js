const area = require('./area');
const findSearchArea = area.findSearchArea;
const adjustSearchAreaPoints = area.adjustSearchAreaPoints;

/**
 * Checks if a toll have the have the same route/section direction
 * return: true if there is a match, false otherwise
 */
function isValidToll (sectionDirection, toll) {
  if (toll.direction === 0 || toll.direction === sectionDirection.lat || toll.direction === sectionDirection.lng) {
    return true;
  }
  return false;
}

/**
 * find possibles tolls in a section (according to origin and destination)
 * return: list of possible tolls (if any)
 */
function tollsInSection (originPoint, destinationPoint, TotalTolls) {
  const tolls = TotalTolls;
  const sectionDirection = findDirection(originPoint, destinationPoint);
  const tollArray = [];
  // const startLatitude = originPoint.lat;
  // const endLatitude = destinationPoint.lat;

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
    /* if (validToll === false || validToll === true) {
      console.log('Peaje');
      console.log(tolls[index]);
      console.log('valor de valid: ', validToll);
      console.log('');
    } */
    if (validToll) {
      tollArray.push(tolls[index]);
    }
  }
  return tollArray;
}

/**
 * Find the direction of the route according to origin and destination
 * return: object with latitude and longitude with the corresponding number
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
 * Check if a toll is in route
 * return: list of tolls in route (if any)
 */
exports.findTollInSection = function (sectionPoints, originPoint, destinationPoint, TotalTolls) {
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
    const auxLatitude = sectionTolls[toll].coordinates.lat;
    const auxString = auxLatitude.toString().split('.');
    // const tollLatitude = parseFloat(sectionTolls[toll].coordinates.lat.toString().slice(0, 5));
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
      // return sectionTolls[toll];
      tollList.push(sectionTolls[toll]);
    }
  }
  return tollList;
};
