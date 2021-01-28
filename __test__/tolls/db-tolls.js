const dbHandler = require('../jest.config');
const toll = require('../../models/tolls');

jest.setTimeout(11000);

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
    expect(typeof (await toll.createToll(newToll))).toEqual(typeof ({}));
  });

  it('It will validate if return the correct object and has not __v', async () => {
    const testToll = await toll.createToll(newToll);
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
    // This is for avoid modificated the actual object and get an errors in the others test
    cNewToll = { ...newToll };
    cNewToll.testing = 'This will not save it';
    expect(await toll.createToll(cNewToll)).not.toHaveProperty('testing');
    expect(await toll.createToll({ name: 'new' })).toBeNull();
    expect(await toll.createToll({ newVar: 'Not' })).toBeNull();
    expect(await toll.createToll({ coordinates: {} })).toBeNull();
    cNewToll.coordinates = 0;
    expect(await toll.createToll(cNewToll)).toBeNull();
  });
});

/**
 * Test the function createToll data base
 */
describe('Test the function read to bringing data', () => {
  it('create & save tolls successfully', async () => {
    const savedToll = await toll.createToll(newToll);

    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedToll._id).toBeDefined();
    expect(savedToll.name).toBe(newToll.name);
    expect(savedToll.coordinates).toEqual(newToll.coordinates);
    expect(savedToll.cost).toEqual(newToll.cost);
    expect(savedToll.direction).toBe(newToll.direction);
    expect(savedToll.group).toBe(newToll.group);
    expect(savedToll.status).toBe(true);
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
});
describe('Test the function get to bringing data', () => {
  it('This will to avoid errors on the function', async () => {
    expect(await toll.getTolls('Hello world')).not.toBeNull();
    expect(await toll.findTollById('Hello world')).toBeNull();
    expect(await toll.findTollById(123)).toBeNull();
    expect(await toll.findTollById([])).toBeNull();
    expect(await toll.findTollById({})).toBeNull();
  });
});

describe('Test the function get to bringing data', () => {
  it('This will check the correct function of update toll', async () => {
    const allTolls = toll.getTolls;
    const id = allTolls[10];
    const test = await toll.updateToll(id, { costs: 0 });
    // expect(test.name).tobe(id)
    // console.log(test);
  });

  it('This will test and send wrong input to update toll', async () => {
    const newsToll = await toll.createToll(newToll);
    const id = newsToll._id;

    expect(await toll.updateToll({})).toBeNull();
    expect(await toll.updateToll(1234)).toBeNull();
    expect(await toll.updateToll([])).toBeNull();
    expect(await toll.updateToll('delete it')).toBeNull();
    expect(await toll.updateToll('1A2A3B')).toBeNull();

    expect(await toll.updateToll({}, {})).toBeNull();
    expect(await toll.updateToll(1234, 1234)).toBeNull();
    expect(await toll.updateToll([], [])).toBeNull();
    expect(await toll.updateToll('delete it', 'delete it')).toBeNull();
    expect(await toll.updateToll('1A2A3B', 'delete it')).toBeNull();

    expect(await toll.updateToll(id, {})).toBeNull();
    expect(await toll.updateToll(id, 1234)).toBeNull();
    expect(await toll.updateToll(id, [])).toBeNull();
    expect(await toll.updateToll(id, 'delete it')).toBeNull();
    expect(await toll.updateToll(id, 'delete it')).toBeNull();
  });
});

describe('Test the function get to bringing data', () => {
  it('This check the function of delete an toll', async () => {
    expect(await toll.deleteToll('Hello-world')).toBeNull();
    // keep in mind
    // expect(await toll.deleteToll(123323412)).toBeNull()
    expect(await toll.deleteToll([])).toBeNull();
    expect(await toll.deleteToll({})).toBeNull();

    const newsToll = await toll.createToll(newToll);
    const id = newsToll._id;
    expect(await toll.deleteToll(id)).not.toBeNull();

    const testToll = await toll.getTolls();
    expect(testToll.length).toBe(0);
  });
});

const newToll = {
  coordinates: {
    lat: 111111,
    lng: 1111111
  },
  direction: 0,
  department: 'ANTIOQUIA',
  name: 'Testing with base',
  operator: 'INCO',
  costs: {
    I: 16800,
    II: 19000,
    III: 41400,
    IV: 53900,
    V: 64500,
    VI: 342232,
    VII: 2423243
  },
  group: 1
};
