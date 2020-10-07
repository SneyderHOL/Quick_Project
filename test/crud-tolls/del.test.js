'use strict';

// const mongoose = require('mongoose');
const dbHandler = require('../jest-mongodb-config');
const toll = require('../../models/tolls');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await dbHandler.connect();
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => {
  await dbHandler.clearDatabase();
});

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
  await dbHandler.closeDatabase();
});

/**
 * Product getById test suite.
 */
describe('Test create tolls in data base', () => {

  it('This will create a new toll and validate return an object', async () => {
    return expect(typeof(await toll.createToll(newToll)))
      .toEqual(typeof({}));
  });

  it('It will validate if return the correct object and has not __v', async () => {
    const testToll = await toll.createToll(newToll)

    expect(testToll.__v)
      .toBeUndefined();

    expect(testToll)
      .toHaveProperty('coordenates');

    expect(testToll)
      .toHaveProperty('direction');

    expect(testToll)
      .toHaveProperty('department');

    expect(testToll)
      .toHaveProperty('name');

    expect(testToll)
      .toHaveProperty('toll_cost');
  });

  it('Will validate the schema to recive an incorrect parameters', async () => {
    /*
    * when the object is create accept more attribute
    */
    newToll.testing = "This will not save it"
    newToll.toll_cost = 2
    const testToll = await toll.createToll(newToll)
    console.log(testToll)
    expect(testToll)
        .not.toHaveProperty('testing');
  });
});

const newToll = {
  "coordenates": {
    "lat": 0,
    "lng": -1
  },
  "direction": 0,
  'department': "ANTIOQUIA",
  "name": "Testing with base",
  "operator": "INCO",
  'toll_cost': {
    "I": 16800,
    "II": 19000,
    "III": 41400,
    "IV": 53900,
    "V": 64500
  }
};
