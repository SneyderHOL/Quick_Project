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
    done();
  });

  it('test the endpoint /tolls for catch errors', async (done) => {
    const r = await request.get('/tolls');
    const body = r.body.data.tolls[4];
    const response = await request.patch(`/tolls/${body._id}`).send({});
    expect(response.status).toBe(200);
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
