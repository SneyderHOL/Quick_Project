const dbHandler = require('../jest.config');
const Vehicles = require('../../models/vehicles');

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
 * Test the function createVehicle data base
 */
describe('Test create Vehicless in data base', () => {
  it('This will create a new Vehicles and validate return an object', async () => {
    expect(typeof (await Vehicles.createVehicle(newCar))).toEqual(typeof ({}));
  });

  it('It will validate if return the correct object and has not __v', async () => {
    const testVehicles = await Vehicles.createVehicle(newCar);

    expect(testVehicles.__v).toBeUndefined();

    expect(testVehicles).toHaveProperty('name');
    expect(testVehicles).toHaveProperty('category');
    expect(testVehicles).toHaveProperty('typeOf');
    expect(testVehicles).toHaveProperty('axis');
    expect(testVehicles).toHaveProperty('fuel_type');
    expect(testVehicles).toHaveProperty('weight');
    expect(testVehicles).toHaveProperty('id');

    expect(testVehicles.category).toHaveProperty('group1');
    expect(testVehicles.category).toHaveProperty('group2');
    expect(testVehicles.category).toHaveProperty('group3');
  });

  it('Will validate the schema and validate to recive an incorrect parameters', async () => {
    // This is for avoid modificated the actual object and get an errors in the others test
    cnewCar = { ...newCar };
    cnewCar.testing = 'This will not save it';
    expect(await Vehicles.createVehicle(cnewCar)).not.toHaveProperty('testing');
    expect(await Vehicles.createVehicle({ name: 'new' })).toBeNull();
    expect(await Vehicles.createVehicle({ newVar: 'Not' })).toBeNull();
    expect(await Vehicles.createVehicle({ coordinates: {} })).toBeNull();
    // cnewCar.coordinates = 0;
    // expect(await Vehicles.createVehicle(cnewCar)).toBeNull();
  });
});

/**
 * Test the function createVehicle data base
 */
describe('Test the function read to bringing data', () => {
  it('create & save Vehicless successfully', async () => {
    const savedCar = await Vehicles.createVehicle(newCar);

    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedCar._id).toBeDefined();
    expect(savedCar.name).toBe(newCar.name);
    expect(savedCar.category).toEqual(newCar.category);
    expect(savedCar.typeOf).toEqual(newCar.typeOf);
    expect(savedCar.axis).toBe(newCar.axis);
    expect(savedCar.fuel_type).toBe(newCar.fuel_type);
    expect(savedCar.weight).toBe(newCar.weight);
  });

  it('This will check the good functioning of the methods', async () => {
    for (const i in [...Array(10).keys()]) {
      await Vehicles.createVehicle(newCar);
    }
    const testVehicles = await Vehicles.findAllVehicles();
    expect(testVehicles.length).toBe(10);

    const id = testVehicles[0]._id;
    const status = testVehicles[0].status;

    const newTestVehicles = await Vehicles.findAllVehicles();
    expect(newTestVehicles[0]._id).toEqual(id);
    expect(newTestVehicles[0].status).toEqual(status);
  });
});
describe('Test the function get to bringing data', () => {
  it('This will to avoid errors on the function', async () => {
    expect(await Vehicles.findAllVehicles('Hello world')).not.toBeNull();
    expect(await Vehicles.findVehicleById('Hello world')).toBeNull();
    expect(await Vehicles.findVehicleById(123)).toBeNull();
    expect(await Vehicles.findVehicleById([])).toBeNull();
    expect(await Vehicles.findVehicleById({})).toBeNull();
  });
});

describe('Test the function get to bringing data', () => {
  it('This will check the correct function of update Vehicles', async () => {
    const allVehicless = Vehicles.findAllVehicles;
    const id = allVehicless[10];
    const test = await Vehicles.updateVehicles(id, { costs: 0 });
  });

  it('This will test and send wrong input to update Vehicles', async () => {
    const newsVehicles = await Vehicles.createVehicle(newCar);
    const id = newsVehicles._id;

    expect(await Vehicles.updateVehicles({})).toBeNull();
    expect(await Vehicles.updateVehicles(1234)).toBeNull();
    expect(await Vehicles.updateVehicles([])).toBeNull();
    expect(await Vehicles.updateVehicles('delete it')).toBeNull();
    expect(await Vehicles.updateVehicles('1A2A3B')).toBeNull();

    expect(await Vehicles.updateVehicles({}, {})).toBeNull();
    expect(await Vehicles.updateVehicles(1234, 1234)).toBeNull();
    expect(await Vehicles.updateVehicles([], [])).toBeNull();
    expect(await Vehicles.updateVehicles('delete it', 'delete it')).toBeNull();
    expect(await Vehicles.updateVehicles('1A2A3B', 'delete it')).toBeNull();

    expect(await Vehicles.updateVehicles(id, {})).toBeNull();
    expect(await Vehicles.updateVehicles(id, 1234)).toBeNull();
    expect(await Vehicles.updateVehicles(id, [])).toBeNull();
    expect(await Vehicles.updateVehicles(id, 'delete it')).toBeNull();
    expect(await Vehicles.updateVehicles(id, 'delete it')).toBeNull();
  });
});

describe('Test the function get to bringing data', () => {
  it('This check the function of delete an Vehicles', async () => {
    expect(await Vehicles.deleteFeaturesById('Hello-world')).toBeNull();
    // keep in mind
    // expect(await Vehicles.deleteFeaturesById(123323412)).toBeNull()
    expect(await Vehicles.deleteFeaturesById([])).toBeNull();
    expect(await Vehicles.deleteFeaturesById({})).toBeNull();

    const newsVehicles = await Vehicles.createVehicle(newCar);
    const id = newsVehicles._id;
    expect(await Vehicles.deleteFeaturesById(id)).not.toBeNull();

    const testVehicles = await Vehicles.findAllVehicles();
    expect(testVehicles.length).toBe(0);
  });
});

const newCar = {
  name: 'rayo',
  category: {
    group1: 1,
    group2: 1,
    group3: 2
  },
  typeOf: 'automovil',
  axis: 4,
  fuel_type: 'gas',
  weight: 34000
};
