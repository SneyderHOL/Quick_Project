'use strict';

// const mongoose = require('mongoose');
const dbHandler = require('../jest-mongodb-config');
const toll = require('../../models/tolls');
const e = require('express');

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
 * Test the function createToll data base
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
      .toHaveProperty('coordinates');

    expect(testToll)
      .toHaveProperty('direction');

    expect(testToll)
      .toHaveProperty('department');

    expect(testToll)
      .toHaveProperty('name');

    expect(testToll)
      .toHaveProperty('operator');

    expect(testToll)
      .toHaveProperty('status');

    expect(testToll)
      .toHaveProperty('group');
  });

  it('Will validate the schema and validate to recive an incorrect parameters', async () => {
    newToll.testing = "This will not save it"
    const testToll = await toll.createToll(newToll)
    expect(testToll)
        .not.toHaveProperty('testing');

    const newTollTest = new toll({coordinates: null, direction: 112});
    const err = await newTollTest.validate();
    expect(err).toBe(undefined);

    expect(toll.createToll({})).resolves.toBeNull()
  });
});


// TollSchema.statics.findTollById = async function (id, callback) {
//   var toll = null;
//   if (mongoose.isValidObjectId(id)) {
//     toll = await this.findById(id).exec();
//   }
//   return toll;
// };

// TollSchema.statics.getTolls = async function () {
//   const tolls = await this.find();
//   return tolls;
// };

/**
 * Test the function createToll data base
 */
describe('Test the function read to bringing data', () => {
  it('This will check the good functioning of the methods', async () => {
    await toll.createToll(newToll)
    const testToll = await toll.getTolls()
    expect(testToll.length).toBe(1)
    console.log(testToll);
  });

  it('This will check the good way correction of the function', async () => {
    console.log(toll.getTolls("Hello world"))
    console.log(toll.findTollById("Hello world"))
  });
});

const newToll = {
  "coordinates": {
    "lat": 0,
    "lng": -1
  },
  "direction": 0,
  'department': "ANTIOQUIA",
  "name": "Testing with base",
  "operator": "INCO",
  'costs': {
    "I": 16800,
    "II": 19000,
    "III": 41400,
    "IV": 53900,
    "V": 64500
  },
  "status": 1,
  "group": 0
};


