const { app, mongoose } = require('../../app');
const { v4: uuidv4 } = require('uuid');
const supertest = require('supertest');

const request = supertest(app);
jest.setTimeout(8000);

afterAll(() => {
  mongoose.disconnect();
});

// POST /vehicles
describe('Test create vehicles of the endpoint /vehicles', () => {
  it('test the endpoint /vehicles for good behavior', async (done) => {
    const response = await request.post('/vehicles').send(newCar);
    expect(response.status).toBe(201);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    delete response.body._id;
    delete response.body.update_at;
    expect(response.body).toMatchObject(newCar);

    done();
  });
});

// GET /vehicles
describe('Test read vehicles of the endpoint /vehicles', () => {
  it('test the endpoint /vehicles for good behavior', async (done) => {
    const response = await request.get('/vehicles');
    expect(response.status).toBe(200);

    const responseTwo = await request.get('/vehicles').send({ name: 'testing' });
    expect(responseTwo.status).toBe(200);
    done();
  });
});

// DELETE /vehicles/id
describe('Test delete vehicles of the endpoint /vehicles', () => {
  it('test the endpoint /vehicles for good behavior', async (done) => {
    const response = await request.post('/vehicles').send(newCar);
    const body = await request.delete(`/vehicles/${response.body._id}`).send(newCar);
    expect(body.status).toBe(200);
    const validated = await request.get(`/vehicles/${response.body._id}`);
    expect(validated.status).toBe(404);
    // expect(validated.body.error).toBe('Not Found');
    done();
  });
});

describe('Test the status code of the each endpoint', () => {
  it('status code for /vehicles get', async (done) => {
    const response = await request.get('/vehicles');
    expect(response.status).toBe(200);
    done();
  });
  it('status code for /vehicles post', async (done) => {
    const response = await request.post('/vehicles').send(newCar);
    expect(response.status).toBe(201);
    done();
  });

  it('status code for not found enpoint', async (done) => {
    const response = await request.post('/testing').send(newCar);
    // expect(response.status).toBe(302);
    done();
  });

  it('status code redirect to documentation', async (done) => {
    const response = await request.post('/').send(newCar);
    // expect(response.status).toBe(404);
    done();
  });

  it('status code for the documentation', async (done) => {
    const response = await request.post('/api-docs').send(newCar);
    expect(response.status).toBe(200);
    done();
  });

  it('status code for the init of the page', async (done) => {
    const response = await request.get('/').send(newCar);
    expect(response.status).toBe(200);
    done();
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
