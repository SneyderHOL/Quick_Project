const area = require('./area');
// const findSearchArea = area.findSearchArea;
const adjustSearchAreaPoints = area.adjustSearchAreaPoints;
// const fs = require('fs');

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

// searching for min and max lat, and lng of a section
function definingarea (sectionPoint, area) {
  if (!area || !sectionPoint) {
    return;
  }
  if (sectionPoint[1] > area.lat.max) {
    area.lat.max = sectionPoint[1];
  } else if (sectionPoint[1] < area.lat.min) {
    area.lat.min = sectionPoint[1];
  }
  if (sectionPoint[0] > area.lng.max) {
    area.lng.max = sectionPoint[0];
  } else if (sectionPoint[0] < area.lng.min) {
    area.lng.min = sectionPoint[0];
  }
}

// sorting function
function mergeSort (sectionPoints, area) {
  var arrayLen = sectionPoints.length;
  if (arrayLen < 2) {
    definingarea(sectionPoints[0], area);
    return sectionPoints;
  }
  var mid = Math.floor(arrayLen / 2);
  var left = sectionPoints.slice(0, mid);
  var right = sectionPoints.slice(mid);

  return merge(mergeSort(left, area), mergeSort(right, area), area);
}

function merge (leftArray, rightArray, area) {
  var result = [];
  var leftArrayLen = leftArray.length;
  var rightArrayLen = rightArray.length;
  var left = 0;
  var right = 0;
  while (left < leftArrayLen && right < rightArrayLen) {
    if (leftArray[left][1] < rightArray[right][1]) {
      definingarea(leftArray[left], area);
      result.push(leftArray[left]);
      left++;
    } else {
      definingarea(rightArray[right], area);
      result.push(rightArray[right]);
      right++;
    }
  }
  return result.concat(leftArray.slice(left)).concat(rightArray.slice(right));
}

// binary search in sectionPoints
function binarySearchLeft (points, search) {
  const lastIndex = points.length;
  let left = 0;
  let right = lastIndex;
  let mid = 0;
  let aux = 0;
  while (left < right) {
    mid = Math.floor((left + right) / 2);
    aux = points[mid][1].toString().split('.');
    aux = parseFloat(aux[0] + '.' + aux[1].slice(0, 3));
    if (aux < search) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

/**
 * Check if a toll is in route
 * return: list of tolls in route (if any)
 */
exports.findTollInSection = function (sectionPoints, originPoint, destinationPoint, TotalTolls) {
  const sectionDirection = findDirection(originPoint, destinationPoint);
  // const searchAreaPoints = findSearchArea(sectionPoints);
  /*
  fs.appendFile('datos.txt', JSON.stringify(originPoint), function (err) {
    if (err) return console.log(err);
    console.log('Saved');
  });
  fs.appendFile('datos.txt', '\n', function (err) {
    if (err) return console.log(err);
    console.log('Saved');
  });
  fs.appendFile('datos.txt', JSON.stringify(destinationPoint), function (err) {
    if (err) return console.log(err);
    console.log('Saved');
  });
  fs.appendFile('datos.txt', '\n\n', function (err) {
    if (err) return console.log(err);
    console.log('Saved');
  });
  */
  const searchAreaPoints = {
    lat: {
      min: sectionPoints[0][1],
      max: sectionPoints[0][1]
    },
    lng: {
      min: sectionPoints[0][0],
      max: sectionPoints[0][0]
    }
  };
  const sortedSectionPoints = mergeSort(sectionPoints, searchAreaPoints);
  adjustSearchAreaPoints(searchAreaPoints, originPoint, destinationPoint, sectionDirection);
  /*
  fs.appendFile('datos.txt', sortedSectionPoints, function (err) {
    if (err) return console.log(err);
    console.log('Saved');
  });
  fs.appendFile('datos.txt', '\n\n', function (err) {
    if (err) return console.log(err);
    console.log('Saved');
  });
  fs.appendFile('datos.txt', JSON.stringify(originPoint), function (err) {
    if (err) return console.log(err);
    console.log('Saved');
  });
  fs.appendFile('datos.txt', '\n', function (err) {
    if (err) return console.log(err);
    console.log('Saved');
  });
  fs.appendFile('datos.txt', JSON.stringify(destinationPoint), function (err) {
    if (err) return console.log(err);
    console.log('Saved');
  });
  fs.appendFile('datos.txt', '\n\n', function (err) {
    if (err) return console.log(err);
    console.log('Saved');
  });
  */
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
    /*
    fs.appendFile('datos.txt', '\nPossible tolls\n', function (err) {
      if (err) return console.log(err);
      console.log('Saved');
    });
    fs.appendFile('datos.txt', sectionTolls[toll], function (err) {
      if (err) return console.log(err);
      console.log('Saved');
    });
    */
    const auxLatitude = sectionTolls[toll].coordinates.lat;
    const auxString = auxLatitude.toString().split('.');
    // const tollLatitude = parseFloat(sectionTolls[toll].coordinates.lat.toString().slice(0, 5));
    const tollLatitude = parseFloat(auxString[0] + '.' + auxString[1].slice(0, 3));
    const tollLongitude = sectionTolls[toll].coordinates.lng;
    const errorFactor = 0.001;

    const searchRangeLatitudeMin = tollLatitude - errorFactor;
    const searchRangeLatitudeMax = tollLatitude + errorFactor;
    const searchRangeLongitudeMin = tollLongitude - errorFactor;
    const searchRangeLongitudeMax = tollLongitude + errorFactor;
    let foundIt = false;
    let searchIndex = 0;
    searchIndex = binarySearchLeft(sortedSectionPoints, searchRangeLatitudeMin);
    /*
    fs.appendFile('datos.txt', '\nFirstIndex\n', function (err) {
      if (err) return console.log(err);
      console.log('Saved');
    });
    fs.appendFile('datos.txt', sortedSectionPoints[searchIndex], function (err) {
      if (err) return console.log(err);
      console.log('Saved');
    });
    */
    for (; searchIndex < sortedSectionPoints.length; searchIndex++) {
      const minimum = searchRangeLatitudeMin - 0.003;
      const pointLat = sortedSectionPoints[searchIndex][1];
      const pointLng = sortedSectionPoints[searchIndex][0];
      if (pointLat >= minimum && pointLat <= searchRangeLatitudeMax) {
        if (pointLng >= searchRangeLongitudeMin && pointLng <= searchRangeLongitudeMax) {
          foundIt = true;
          break;
        }
      }
    }
    if (foundIt === false) {
      /*
      fs.appendFile('datos.txt', '\nLastIndex\n', function (err) {
        if (err) return console.log(err);
        console.log('Saved');
      });
      fs.appendFile('datos.txt', sortedSectionPoints[searchIndex], function (err) {
        if (err) return console.log(err);
        console.log('Saved');
      });
      */
      continue;
    } else {
      /*
      fs.appendFile('datos.txt', '\nTollFound\n', function (err) {
        if (err) return console.log(err);
        console.log('Saved');
      });
      fs.appendFile('datos.txt', sectionTolls[toll], function (err) {
        if (err) return console.log(err);
        console.log('Saved');
      });
      */
      tollList.push(sectionTolls[toll]);
    }
  }
  return tollList;
};
