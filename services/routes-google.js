const fetch = require('node-fetch');
const Toll = require('../models/tolls');
const costTolls = require('./cost-tolls');
const Vehicle = require('../models/vehicles');
const findTollInSection = require('./searchFunctions').findTollInSection;
const cleanFunctions = require('./cleanFunctions');
const cleanPathFunction = cleanFunctions.cleanPathFunction;
const cleanTollsFunction = cleanFunctions.cleanTollsFunction;

// ENV variables
const keyGoogle = process.env.GOOGLE_API;
const keyOpenRoute = process.env.API_OPENROUTES;
/**
 * find a section where there might be a toll
 * return: list of sections
 */
function findSection (steps) {
  const sections = [];
  for (const i in steps) {
    if (steps[i].html_instructions.includes('Toll')) {
      /* iterate throught the result of the road and return it */
      sections.push({
        distance: steps[i].distance.text,
        start_location: steps[i].start_location,
        end_location: steps[i].end_location
      });
    }
  }
  return sections;
}

/**
 * Will request to google direction api return a promise
 * return: the Google API data
 */
const requestRoutesAsync = async (origin, destination) => {
  const url = 'https://maps.googleapis.com/maps/api/directions/json?' +
  `origin=${origin.lat},${origin.lng}` +
  `&destination=${destination.lat},${destination.lng}` +
  `&key=${keyGoogle}`;

  const responseApi = await fetch(url);
  const responseData = await responseApi.json();
  if (responseData.status === 'ZERO_RESULTS') return null;

  return responseData.routes[0].legs[0];
};

/**
 * Will request to google direction api return a promise
 * return: the response payload object
 */
const requestAll = async (origin, destination, vehicleName) => {
  const dataGoogle = await requestRoutesAsync(origin, destination);
  const vehicle = await Vehicle.findBySpecification(vehicleName);
  // const TotalTolls = await Toll.findBySpecification(true);
  const TotalTolls = await Toll.getTolls();

  // check for wrong request or missing key
  if (!dataGoogle || !vehicle.length || !TotalTolls.length) {
    return null;
  }

  const sections = findSection(dataGoogle.steps);
  const tolls = [];

  for (const section in sections) {
    const startSection = sections[section].start_location;
    const endSection = sections[section].end_location;
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car' +
      `?api_key=${keyOpenRoute}&start=${startSection.lng},${startSection.lat}` +
      `&end=${endSection.lng},${endSection.lat}`;

    const response = await fetch(url);
    const dataOpenRoute = await response.json();

    if (dataOpenRoute.error) return null;

    const dataPoints = dataOpenRoute.features[0].geometry.coordinates;
    const toll = findTollInSection(dataPoints, startSection, endSection, TotalTolls);
    if (toll) {
      for (const element in toll) {
        tolls.push(toll[element]);
      }
    }
  }

  const cleanPath = cleanPathFunction(dataGoogle.steps);
  const cleanTolls = cleanTollsFunction(tolls);
  const tollsCost = await costTolls.total(tolls, vehicle);

  return {
    total_kms: dataGoogle.distance.value,
    duration: dataGoogle.duration.text,
    tolls: cleanTolls,
    path: cleanPath,
    toll_expenses: tollsCost
  };
};

module.exports = {
  requestAll
};
