const fetch = require('node-fetch');
//const { keyGoogle, keyOpenRoute } = require('../config');
const keyGoogle = process.env.GOOGLE_API;
const keyOpenRoute = process.env.API_OPENROUTES;
const Toll = require('../models/tolls');

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

  for (const toll in tolls) {
    let validToll = null;

    // North to South and West to East
    if (sectionDirection.lat === 1 && sectionDirection.lng === 4) {
      if (tolls[toll].coordinates.lat >= destinationPoint.lat && tolls[toll].coordinates.lat <= originPoint.lat) {
        if (tolls[toll].coordinates.lng >= originPoint.lng && tolls[toll].coordinates.lng <= destinationPoint.lng) {
          validToll = isValidToll(sectionDirection, tolls[toll]);
        }
      }
    // North to South and East to West
    } else if (sectionDirection.lat === 1 && sectionDirection.lng === 3) {
      if (tolls[toll].coordinates.lat >= destinationPoint.lat && tolls[toll].coordinates.lat <= originPoint.lat) {
        if (tolls[toll].coordinates.lng >= destinationPoint.lng && tolls[toll].coordinates.lng <= originPoint.lng) {
          validToll = isValidToll(sectionDirection, tolls[toll]);
        }
      }
    // South to North and West to East ->
    } else if (sectionDirection.lat === 2 && sectionDirection.lng === 4) {
      if (tolls[toll].coordinates.lat >= originPoint.lat && tolls[toll].coordinates.lat <= destinationPoint.lat) {
        if (tolls[toll].coordinates.lng >= originPoint.lng && tolls[toll].coordinates.lng <= destinationPoint.lng) {
          validToll = isValidToll(sectionDirection, tolls[toll]);
        }
      }
    // South to North and East to West <-
    } else if (sectionDirection.lat === 2 && sectionDirection.lng === 3) {
      if (tolls[toll].coordinates.lat >= originPoint.lat && tolls[toll].coordinates.lat <= destinationPoint.lat) {
        if (tolls[toll].coordinates.lng >= destinationPoint.lng && tolls[toll].coordinates.lng <= originPoint.lng) {
          validToll = isValidToll(sectionDirection, tolls[toll]);
        }
      }
    }
    if (validToll) {
      tollArray.push(tolls[toll]);
    }
  }
  return tollArray;
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
  console.log(sections); //pantalla o archivo
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
  if (sectionDirection.lat === 1) {
    originPoint.lat += 0.003;
    destinationPoint.lat -= 0.003;
  } else {
    originPoint.lat -= 0.003;
    destinationPoint.lat += 0.003;
  }

  const sectionTolls = tollsInSection(originPoint, destinationPoint, TotalTolls);

  for (const toll in sectionTolls) {
    const tollLatitude = parseFloat(sectionTolls[toll].coordinates.lat.toString().slice(0, 5));
    const tollLongitude = sectionTolls[toll].coordinates.lng;

    const searchRangeLatitudeMin = tollLatitude - 0.003;
    const searchRangeLatitudeMax = tollLatitude + 0.003;

    const searchRangeLongitudeMin = tollLongitude - 0.003;
    const searchRangeLongitudeMax = tollLongitude + 0.003;

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
      return sectionTolls[toll];
    }
  }
  return null;
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
const requestAll = async (origin, destination) => {
  const dataGoogle = await requestRoutesAsync(origin, destination);
  const sections = findSection(dataGoogle.steps);
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
    console.log(dataPoints);
    const toll = findTollInRoute(dataPoints, startSection, endSection, TotalTolls);
    if (toll) tolls.push(toll);
  }
  return tolls;
};

module.exports = {
  requestAll
};
