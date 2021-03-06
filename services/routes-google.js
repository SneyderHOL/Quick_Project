const fetch = require('node-fetch');
const Toll = require('../models/tolls');
const costTolls = require('./cost-tolls');
const Vehicle = require('../models/vehicles');
const findTollInSection = require('./searchFunctions').findTollInSection;
const validateArea = require('./area').limits;
const redisClient = require('../app').redis;
// const redisClient = null;
const missingTolls = require('./missingTollsFunction').missingTollsArray;
// const cleanFunctions = require('./cleanFunctions');
// const cleanPathFunction = cleanFunctions.cleanPathFunction;
// const cleanTollsFunction = cleanFunctions.cleanTollsFunction;
// const redisClient = require('../init_redis').redisClient;
// const checkForMissingTolls = require('./searchFunctions').checkForMissingTolls;
// const redisClient = require('../init_redis').redisClient;
// const redisClient = null;
// ENV variables
const keyGoogle = process.env.GOOGLE_API;
const keyOpenRoute = process.env.API_OPENROUTES;

/**
 * find a section where there might be a toll
 * return: list of sections
 */
function findSection (steps, array) {
  const sections = [];
  const path = [];
  let start;
  let end;

  for (const i in steps) {
    start = steps[i].start_location;
    end = steps[i].end_location;
    // checking for the missing tolls
    for (const idx in array) {
      if ((steps[i].start_location.lat === array[idx].surNorte.lat &&
          steps[i].start_location.lng === array[idx].surNorte.lng) ||
          (steps[i].start_location.lat === array[idx].norteSur.lat &&
          steps[i].start_location.lng === array[idx].norteSur.lng)) {
        array[idx].inRoute = true;
      }
    }
    if (steps[i].html_instructions.includes('Toll')) {
      /* iterate throught the result of the road and return it */
      sections.push({
        distance: steps[i].distance.text,
        start_location: start,
        end_location: end
      });
    }
    path.push({ start, end });
  }

  return {
    tolls: sections,
    path: path
  };
}

/**
 * Will request to google direction api return a promise
 * return: the Google API data
 */
const requestRoutesAsync = async (origin, destination) => {
  if (typeof (origin) === typeof ({})) origin = `${origin.lat},${origin.lng}`;
  if (typeof (destination) === typeof ({})) destination = `${destination.lat},${destination.lng}`;

  const url = 'https://maps.googleapis.com/maps/api/directions/json?' +
  `origin=${origin}&destination=${destination}&key=${keyGoogle}`;

  const responseApi = await fetch(url);

  let responseData = await responseApi.json();
  if (responseApi.status === 400 || responseData.status === 'ZERO_RESULTS' || responseData.status === 'NOT_FOUND') {
    console.error('Wrong coordinates');
    return { error: 'Bad gateway', status: 502 };
  }

  responseData = responseData.routes[0].legs[0];

  if (!validateArea(responseData.start_location) || !validateArea(responseData.end_location)) {
    console.log(!validateArea(responseData.start_location), !validateArea(responseData.end_location));
    console.error('The direction is out of the colombia');
    return { error: 'out of colombia', status: 401 };
  }

  return responseData;
};

/**
 * Will request to google direction api return a promise
 * return: the response payload object
 */
const requestAll = async (origin, destination, vehicleName) => {
  const vehicle = await Vehicle.findBySpecification(vehicleName);
  const TotalTolls = await Toll.findBySpecification(true);

  // check vehicles or tolls
  if (vehicle.length === 0 || TotalTolls.length === 0) {
    console.log('vehicles or tolls missing');
    console.log(vehicle === null, TotalTolls.length === 0);
    return null;
  }

  const dataGoogle = await requestRoutesAsync(origin, destination);
  if (dataGoogle.error !== undefined) return dataGoogle;

  // variables to use cache
  let isCache = false;
  let jsonData = null;

  const sections = findSection(dataGoogle.steps, missingTolls);
  const tolls = [];

  for (const section in sections.tolls) {
    isCache = false;
    const startSection = sections.tolls[section].start_location;
    const endSection = sections.tolls[section].end_location;

    const key = startSection.lat.toString() + startSection.lng.toString() + endSection.lat.toString() + endSection.lng.toString();

    if (redisClient) {
      const data = await redisClient.get(key);
      if (data) {
        isCache = true;
        jsonData = JSON.parse(data);
        for (const item in jsonData) {
          tolls.push(jsonData[item]);
        }
      }
    }
    if (!isCache) {
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
        console.log('usando redis');
        redisClient.setex(key, 43200, JSON.stringify(toll));
      }

      if (toll) {
        for (const element in toll) {
          tolls.push(toll[element]);
        }
      }
    }
  }

  for (const idx in missingTolls) {
    if (missingTolls[idx].inRoute === true) {
      const toll = TotalTolls.filter((element) => {
        if (element._id.toString() === missingTolls[idx]._id) {
          return element;
        }
      });
      if (toll.length > 0) {
        tolls.push(toll[0]);
        missingTolls[idx].inRoute = false;
      }
    }
  }

  // const cleanPath = cleanPathFunction(dataGoogle.steps);
  // const cleanTolls = cleanTollsFunction(tolls);
  const tollsCost = await costTolls.total(tolls, vehicle);
  let kms = dataGoogle.distance.value;
  if (kms > 0) { kms /= 1000; }

  let totalExpencesVehicle = 0;
  Object.values(vehicle[0].features).forEach((element) => { totalExpencesVehicle += element; });
  totalExpencesVehicle *= kms;

  let priceFuel;
  if (vehicle[0].fuel_type === 'gas') {
    priceFuel = 8500;
  } else {
    priceFuel = 6900;
  }

  // first calculate how many liters consume the vehicles, and after that pass to galons
  // and for the last multiplicate the price of the galon in colombia
  const literPerGalon = 4.54609;
  const totalFuel = ((vehicle[0].literPer100Kilometer * (kms / 100)) / literPerGalon) * priceFuel;

  return {
    total_expenses: '$ ' + Math.ceil(tollsCost.total + totalFuel + totalExpencesVehicle),
    total_kms: kms,
    duration: dataGoogle.duration.text,
    total_vehicle_expenses: Math.ceil(totalExpencesVehicle),
    total_fuel_cost: Math.ceil(totalFuel),
    toll_expenses: tollsCost,
    total_tolls: tolls.length,
    tolls: tolls,
    path: sections.path
  };
};

module.exports = { requestAll };
