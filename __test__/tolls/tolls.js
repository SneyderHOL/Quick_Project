const { app, mongoose } = require('../../app');
const { v4: uuidv4 } = require('uuid');
const supertest = require('supertest');

const request = supertest(app);
jest.setTimeout(8000);

afterAll(() => {
  mongoose.disconnect();
});

// POST /tolls
describe('Test create tolls of the endpoint /tolls', () => {
  it('test the endpoint /tolls for good behavior', async (done) => {
    const response = await request.post('/tolls').send(newToll);
    expect(response.status).toBe(201);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    delete response.body._id;
    delete response.body.update_at;
    expect(response.body).toMatchObject(newToll);

    // const newTolltest = {
    //   name: 'test',
    //   coordinates: {
    //     dest: 1.1
    //   },
    //   costs: {
    //     I: 1000
    //   }
    // };
    // const test = await request.post('/tolls').send(newTolltest);
    // expect(test.status).toBe(201);

    done();
  });

  it('test the endpoint /tolls for catch errors', async (done) => {
    // const responseError = 'Send the complete information, missing coordinates or the name of toll';

    // const responseTwo = await request.post('/tolls').send({});
    // expect(Object.is(responseTwo.body.error, responseError)).toBe(true);
    // expect(responseTwo.status).toBe(400);

    // const responseThree = await request.post('/tolls').send('This is not a json');
    // expect(Object.is(responseThree.body.error, 'Server requires application/json')).toBe(true);
    // expect(responseThree.status).toBe(400);

    // const responseFour = await request.post('/tolls').send({ name: 'Nice' });
    // expect(Object.is(responseFour.body.error, responseError)).toBe(true);
    // expect(responseFour.status).toBe(400);

    // const newTolltest = {
    //   name: 'test',
    //   coordinates: {
    //     dest: 1.1
    //   },
    //   costs: {}
    // };
    // const responseFive = await request.post('/tolls').send(newTolltest);
    // expect(Object.is(responseFive.body.error, 'Please give costs of tolls')).toBe(true);
    // expect(responseFive.status).toBe(400);

    done();
  });
});

// GET /tolls
describe('Test read tolls of the endpoint /tolls', () => {
  it('test the endpoint /tolls for good behavior', async (done) => {
    const response = await request.get('/tolls');
    expect(response.status).toBe(200);

    const responseTwo = await request.get('/tolls').send({ name: 'testing' });
    expect(responseTwo.status).toBe(200);
    done();
  });
});

// PATCH /tolls/id
describe('Test update tolls of the endpoint /tolls', () => {
  it('test the endpoint /tolls for good behavior', async (done) => {
    const response = await request.get('/tolls');
    const body = response.body.data.tolls[1];
    // const testToll = {
    //   name: uuidv4(),
    //   newAttribute: true
    // };
    const testToll = {
      name: uuidv4()
    };
    const update = await request.patch(`/tolls/${body._id}`).send(testToll);
    expect(update.status).toBe(200);
    expect(body._id).not.toBe(update.body.id);
    expect(update.body.newAttribute).toBeUndefined();

    done();
  });

  it('test the endpoint /tolls for catch errors', async (done) => {
    const r = await request.get('/tolls');
    expect(r.status).toBe(200);
    const body = r.body.data.tolls;
    let update = null;
    let response = await request.patch('/tolls/noid').send({});
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Toll Not found');
    const oldTold = body[2];
    const toll = body[2];
    const testA = {
      testOne: {
        direction: 1
      },
      testTwo: {
        department: 'MEXICO'
      },
      testThree: {
        coordinates: {
          lat: 3.449598,
          lng: -76.520473
        }
      },
      testFour: { costs: { I: 16800 } }
    };

    response = await request.patch(`/tolls/${toll._id}`).send({});
    expect(response.status).toBe(200);

    update = await request.patch(`/tolls/${toll._id}`).send(testA.testOne);
    expect(update.body.direction).toBe(testA.testOne.direction);
    expect(update.status).toBe(200);

    update = await request.patch(`/tolls/${toll._id}`).send(testA.testTwo);
    expect(update.body.department).toBe(testA.testTwo.department);
    // expect(update.body.department).not.toBe(oldTold.department)

    update = await request.patch(`/tolls/${toll._id}`).send(testA.testFour);
    expect(update.body.costs).toMatchObject(testA.testFour.costs);
    // expect(update.body.costs).not.toMatchObject(oldTold.costs);

    // request.patch(`/tolls/${bodyfive._id}`).send(testTollfive);
    // update = await request.get(`/tolls/${bodyfive._id}`);
    // expect(update.body.coordinates).toMatchObject(testTollfive.coordinates);
    // expect(newToll.coordinates).not.toMatchObject(update.coordinates);

    //   operator: 'INCO'
    //   status: true,
    //   group: 2

    done();
  });
});

// DELETE /tolls/id
describe('Test delete tolls of the endpoint /tolls', () => {
  it('test the endpoint /tolls for good behavior', async (done) => {
    const response = await request.post('/tolls').send(newToll);
    const body = await request.delete(`/tolls/${response.body._id}`).send(newToll);
    expect(body.status).toBe(200);
    const validated = await request.get(`/tolls/${response.body._id}`);
    expect(validated.status).toBe(404);
    // expect(validated.body.error).toBe('Not Found');
    done();
  });

  it('test the endpoint /tolls for catch errors', async (done) => {
    const r = await request.get('/tolls');
    const body = r.body.data.tolls[4];
    const response = await request.patch(`/tolls/${body._id}`).send({});
    expect(response.status).toBe(200);
    // expect(Object.is(response.body.error, 'Bad Request, please send complete information')).toBe(true);
    done();
  });
});

const newToll = {
  coordinates: {
    lat: 3.449598,
    lng: -76.520473
  },
  direction: 0,
  department: 'ANTIOQUIAS',
  name: 'Testing with base',
  operator: 'INCO',
  costs: {
    I: 16800,
    II: 19000,

    III: 41400,
    IV: 53900,
    V: 64500
  },
  status: true,
  group: 2
};
