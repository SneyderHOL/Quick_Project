const fetch = require('node-fetch');
const Toll = require('../models/tolls');
const costTolls = require('./cost-tolls');
const Vehicle = require('../models/vehicles');
const findTollInSection = require('./searchFunctions').findTollInSection;
const cleanFunctions = require('./cleanFunctions');
const cleanPathFunction = cleanFunctions.cleanPathFunction;
// const cleanTollsFunction = cleanFunctions.cleanTollsFunction;
// const redisClient = require('../init_redis').redisClient;
const redisClient = require('../app').redis;
// const checkForMissingTolls = require('./searchFunctions').checkForMissingTolls;
// const redisClient = null;
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
  const vehicle = await Vehicle.findBySpecification(vehicleName);
  const TotalTolls = await Toll.findBySpecification(true);

  // check vehicles or tolls
  if (!vehicle || TotalTolls.length === 0) {
    console.log('vehicles or tolls missing');
    console.log(vehicle === null, TotalTolls.length === 0);
    return null;
  }

  const dataGoogle = await requestRoutesAsync(origin, destination);
  // check for wrong request or missing key
  if (!dataGoogle) {
    console.log('wrong request or missing key from google API');
    console.log(dataGoogle === null);
    return null;
  }

  // variables to use cache
  let isCache = false;
  let jsonData = null;

  const sections = findSection(dataGoogle.steps);
  const tolls = [];

  for (const section in sections) {
    isCache = false;
    const startSection = sections[section].start_location;
    const endSection = sections[section].end_location;
    const key = startSection.lat.toString() + startSection.lng.toString() + endSection.lat.toString() + endSection.lng.toString();

    if (redisClient) {
      console.log('Usando redis');
      const data = await redisClient.get(key);
      if (data) {
        console.log('Usando cache');
        // console.log(data);
        isCache = true;
        jsonData = JSON.parse(data);
        for (const item in jsonData) {
          tolls.push(jsonData[item]);
        }
      }
    }
    if (!isCache) {
      console.log('No cache');
      const url = 'https://api.openrouteservice.org/v2/directions/driving-car' +
        `?api_key=${keyOpenRoute}&start=${startSection.lng},${startSection.lat}` +
        `&end=${endSection.lng},${endSection.lat}`;

      const response = await fetch(url);
      const dataOpenRoute = await response.json();

      if (dataOpenRoute.error) {
        console.log('openroute error');
        return null;
      }

      const dataPoints = dataOpenRoute.features[0].geometry.coordinates;
      const toll = findTollInSection(dataPoints, startSection, endSection, TotalTolls);
      // save data to redis
      if (redisClient) {
        // redisClient.set(key, JSON.stringify(toll));
        redisClient.setex(key, 1440, JSON.stringify(toll));
      }

      if (toll) {
        for (const element in toll) {
          tolls.push(toll[element]);
        }
      }
    }
  }
  // checkForMissingTolls(tolls, TotalTolls);
  const cleanPath = cleanPathFunction(dataGoogle.steps);
  // const cleanTolls = cleanTollsFunction(tolls);
  const tollsCost = await costTolls.total(tolls, vehicle);
  let kms = dataGoogle.distance.value;
  if (kms > 0) { kms /= 1000; }
  return {
    total_kms: kms,
    duration: dataGoogle.duration.text,
    tolls: tolls,
    path: cleanPath,
    toll_expenses: tollsCost
  };
};

module.exports = {
  requestAll
};
