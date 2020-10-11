const dbHandler = require('../jest.config');
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
 * Test the function createToll data base
 */
describe('Test create tolls in data base', () => {

  it('This will create a new toll and validate return an object', async () => {
    return expect(typeof(await toll.createToll(newToll)))
      .toEqual(typeof({}));
  });

  it('It will validate if return the correct object and has not __v', async () => {
    const testToll = await toll.createToll(newToll)
    expect(testToll.__v).toBeUndefined();

    expect(testToll).toHaveProperty('coordinates');
    expect(testToll).toHaveProperty('direction');
    expect(testToll).toHaveProperty('department');
    expect(testToll).toHaveProperty('name');
    expect(testToll).toHaveProperty('operator');
    expect(testToll).toHaveProperty('group');
    expect(testToll).toHaveProperty('status');

  });

  it('Will validate the schema and validate to recive an incorrect parameters', async () => {
    newToll.testing = "This will not save it"
    expect(await toll.createToll(newToll)).not.toHaveProperty('testing');

    const newTollTest = new toll({coordinates: null, direction: 112});
    const err = await newTollTest.validate();
    expect(err).toBe(undefined);

    expect(toll.createToll({})).resolves.toBeNull()
  });
});

/**
 * Test the function createToll data base
 */
describe('Test the function read to bringing data', () => {
  it('create & save user successfully', async () => {
    const validToll = new toll(newToll);
    const savedToll = await validToll.save();

    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedToll._id).toBeDefined();
    expect(savedToll.name).toBe(newToll.name);
    expect(savedToll.coordinates).toEqual(newToll.coordinates);
    expect(savedToll.cost).toEqual(newToll.cost);
    expect(savedToll.direction).toBe(newToll.direction);
    expect(savedToll.group).toBe(newToll.group);
  });

  it('This will check the good functioning of the methods', async () => {
    for (const i in [...Array(10).keys()]) {
      await toll.createToll(newToll);
    }
    const testToll = await toll.getTolls();
    expect(testToll.length).toBe(10);

    const id = testToll[0]._id;
    const status = testToll[0].status;

    const newTestToll = await toll.getTolls();
    expect(newTestToll[0]._id).toEqual(id);
    expect(newTestToll[0].status).toEqual(status);
  });

  it('This will to avoid errors on the function', async () => {
    // console.log(await toll.createToll(newToll))
    expect(await toll.getTolls("Hello world")).not.toBeNull()
    expect(await toll.findTollById("Hello world")).toBeNull()
    expect(await toll.findTollById(123)).toBeNull()
    expect(await toll.findTollById([])).toBeNull()
    expect(await toll.findTollById({})).toBeNull()
  });

  it('This will check the function of update toll', async () => {
    const newsToll = await toll.createToll({ "name": "testing" });
    const id  = newsToll._id;

    expect(await toll.updateToll({})).toBeNull()
    expect(await toll.updateToll(1234)).toBeNull()
    expect(await toll.updateToll([])).toBeNull()
    expect(await toll.updateToll('delete it')).toBeNull()
    expect(await toll.updateToll('1A2A3B')).toBeNull()

    expect(await toll.updateToll({}, {})).toBeNull()
    expect(await toll.updateToll(1234, 1234)).toBeNull()
    expect(await toll.updateToll([], [])).toBeNull()
    expect(await toll.updateToll('delete it','delete it')).toBeNull()
    expect(await toll.updateToll('1A2A3B', 'delete it')).toBeNull()

    expect(await toll.updateToll(id, {})).toBeNull()
    expect(await toll.updateToll(id, 1234)).toBeNull()
    expect(await toll.updateToll(id, [])).toBeNull()
    expect(await toll.updateToll(id,'delete it')).toBeNull()
    expect(await toll.updateToll(id, 'delete it')).toBeNull()

    const test = await toll.updateToll(id, {"costs": 0})
    expect(test.costs).toBe(0)
  });

  it('This check the function of delete an toll', async () => {

    expect(await toll.deleteToll("Hello-world")).toBeNull()
    expect(await toll.deleteToll(123323412)).toBeNull()
    expect(await toll.deleteToll([])).toBeNull()
    expect(await toll.deleteToll({})).toBeNull()

    const newsToll = await toll.createToll({ "name": "testing" });
    const id = newsToll._id;
    expect(await toll.deleteToll(id)).not.toBeNull()

    const testToll = await toll.getTolls();
    expect(testToll.length).toBe(0);
  });
});

const newToll = {
  "coordinates": {
    "lat": 0,
    "lng": -1
  },
  "direction": 0,
  "department": "ANTIOQUIA",
  "name": "Testing with base",
  "operator": "INCO",
  "costs": {
    "I": 16800,
    "II": 19000,

    "III": 41400,
    "IV": 53900,
    "V": 64500
  },
  "status": 1,
  "group": 0
};
