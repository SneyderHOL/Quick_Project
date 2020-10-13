const fetch = require('node-fetch');
const keyGoogle = process.env.GOOGLE_API;
const keyOpenRoute = process.env.API_OPENROUTES;
const Toll = require('../models/tolls');
const costTolls = require('./cost-tolls');
const findTollInSection = require('./searchFunctions').findTollInSection;
const cleanFunctions = require('./cleanFunctions');
const cleanPathFunction = cleanFunctions.cleanPathFunction;
const cleanTollsFunction = cleanFunctions.cleanTollsFunction;

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
  return responseData.routes[0].legs[0];
};

/**
 * Will request to google direction api return a promise
 * return: the response payload object
 */
const requestAll = async (origin, destination, vehicleName) => {
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
    const toll = findTollInSection(dataPoints, startSection, endSection, TotalTolls);
    if (toll) {
      for (const element in toll) {
        tolls.push(toll[element]);
      }
    }
  }
  tollsCost = await costTolls.total(tolls, vehicleName);
  const cleanPath = cleanPathFunction(dataGoogle.steps);
  const cleanTolls = cleanTollsFunction(tolls);
  payload = {
    total_kms: dataGoogle.distance.value,
    duration: dataGoogle.duration.text,
    tolls: cleanTolls,
    path: cleanPath,
    toll_expenses: tollsCost
  };
  return payload;
};

module.exports = {
  requestAll
};
