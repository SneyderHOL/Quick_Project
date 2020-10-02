
// Find the direction of the route according to origin and destination
function findDirection (origin, destination) {
  if (typeof (origin) !== 'object' || typeof (destination) !== 'object') {
    console.log('Wrong input type');
    return;
  }
  /* Directions: 1- North - South
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


function findToll (sectionPoints, sectionTollsFile) {
  //const sectionTolls = orderSectionTolls(sectionTollsFile);
  const sectionTolls = tollsInSection(sectionTollsFile);
  for (let toll in sectionTolls) {
    const tollLatitude = parseFloat(toll.coordenates.lat.toFixed(3));
    searchRangeLatitudeMin = tollLatitude - 0.001;
    searchRangeLatitudeMax = tollLatitude + 0.001;
    // sectionToll debe estar ordenado de menor a mayor latitud????
    // index = buscar indice del elemento del arreglo sectionPoints que sea igual a searchRangeLatitudeMin:
    let index = findIndex(sectionPoints.features.geometry.coordinates, searchRangeLatitudeMin);
    // validar el indice del metodo de busqueda
    if (index === -1) {
      continue;
    }
    // for (let i = index; sectionPoints.features.geometry.coordinate[i][1] <= searchRangeLatitudeMax; i++) {
    let lower = false;
    let greater = false;

    const pointLongitude = sectionPoints.features.geometry.coordinate;
    // lng = 0, lat = 1
    do {
      if (index >== pointLongitude.length) {
	break;
      }
      if (lower === true && greater === true) {
	return toll;
      }
      if (pointLongitude[index][0] <== toll.coordenates.lng) {
	lower = true;
      } else {
	greater = true;
      }
      index++;
    } while (pointLongitude[index][0] >== searchRangeLatitudeMin && pointLongitude[index][0] <== searchRangeLatitudeMax);
  }
  return null;
}

// sorting by latitude value
function orderSectionTolls (sectionTolls) {
  // use of MergeSort to sort sectionTolls
  const sectionTollsLength = sectionTolls.length;
  if (sectionTollsLength < 2) {
    return sectionTolls;
  }
  
  const mid = Math.floor(sectionTollsLength / 2);
  const leftArray = sectionTolls.slice(0, mid);
  const rightArray =sectionTolls.slice(mid);
  
  return merge(orderSectionTolls(leftArray), orderSectionTolls(rightArray));
}

function merge (leftArray, rightArray) {
  const result = [];
  const leftArrayLength = leftArray.length;
  const rightArrayLength = rightArray.length;
  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < leftArrayLength && rightIndex < rightArrayLength) {
    if (leftArray[leftIndex].lat < rightArray[rightIndex].lat) {
      result.push(leftArray[rightIndex++]);
    } else {
      result.push(rightArray[rightArrayIndex++]);
    }
  }
  return result.concat(leftArray.slice(leftIndex)).concat(rightArray.slice(rightIndex));
}

function tollsInSection (originPoint, destinationPoint, tollsFile) {
  // load tolls from file
  const tolls = require(`../${tollsFile}`).data.tolls;
  const sectionDirection = findDirection(originPoint, destinationPoint);
  const tollArray = [];
  // selecting tolls that matches the trip's direction
  for (let toll in tolls) {
    let validToll = null;
    /*
    // if North to South or else South to North
    if (sectionDirection.lat === 1) {
      if (toll.coordenates.lat >= destinationPoint.lat && toll.coordenates.lat <= originPoint.lat) {
        // if West to East or else East to West
        if (sectionDirection.lng === 4) {
          if (toll.coordenates.lng >= originPoint.lng && toll.coordenates.lng <= destinationPoint.lng) {
            validToll = isValidToll(sectionDirection, toll);
            console.log(toll, validToll);
          }
        } else {
          if (toll.coordenates.lng >= destinationPoint.lng && toll.coordenates.lng <= originPoint.lng) {
            validToll = isValidToll(sectionDirection, toll);
            console.log(toll, validToll);
          }
        }
      }
    } else {
      if (toll.coordenates.lat >= originPoint.lat && toll.coordenates.lat <= destinationPoint.lat) {
        // if West to East or else East to West
        if (sectionDirection.lng === 4) {
          if (toll.coordenates.lng >= originPoint.lng && toll.coordenates.lng <= destinationPoint.lng) {
            validToll = isValidToll(sectionDirection, toll);
            console.log(toll, validToll);
          }
        } else {
          if (toll.coordenates.lng >= destinationPoint.lng && toll.coordenates.lng <= originPoint.lng) {
            validToll = isValidToll(sectionDirection, toll);
            console.log(toll, validToll);
          }
        }
      }
    }*/
    // North to South and West to East
    if (sectionDirection.lat === 1 && sectionDirection.lng === 4) {
      if (toll.coordenates.lat >= destinationPoint.lat && toll.coordenates.lat <= originPoint.lat) {
	if (toll.coordenates.lng >= originPoint.lng && toll.coordenates.lng <= destinationPoint.lng) {
	  validToll = isValidToll(sectionDirection, toll);
	  console.log(toll, validToll);
	}
      }
    }
    // North to South and East to West
    if (sectionDirection.lat === 1 && sectionDirection.lng === 3) {
      if (toll.coordenates.lat >= destinationPoint.lat && toll.coordenates.lat <= originPoint.lat) {
        if (toll.coordenates.lng >= destinationPoint.lng && toll.coordenates.lng <= originPoint.lng) {
          validToll = isValidToll(sectionDirection, toll);
          console.log(toll, validToll);
        }
      }
    }
    // South to North and West to East
    if (sectionDirection.lat === 2 && sectionDirection.lng === 4) {
      if (toll.coordenates.lat >= originPoint.lat && toll.coordenates.lat <= destinationPoint.lat) {
        if (toll.coordenates.lng >= originPoint.lng && toll.coordenates.lng <= destinationPoint.lng) {
          validToll = isValidToll(sectionDirection, toll);
          console.log(toll, validToll);
        }
      }
    }
    // South to North and East to West
    if (sectionDirection.lat === 2 && sectionDirection.lng === 3) {
      if (toll.coordenates.lat >= originPoint.lat && toll.coordenates.lat <= destinationPoint.lat) {
        if (toll.coordenates.lng >= destinationPoint.lng && toll.coordenates.lng <= originPoint.lng) {
          validToll = isValidToll(sectionDirection, toll);
          console.log(toll, validToll);
        }
      }
    }
    if (validToll) {
      tollArray.push(toll);
    }
  }

  // orderSectionTolls();
  return tollArray;
}

function isvalidToll (sectionDirection, toll) {
  if (toll.direction === 0 || toll.direction === sectionDirection.lat || toll.direction === sectionDirection.lng) {
    return true;
  }
  return false;
}

