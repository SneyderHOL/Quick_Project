const { app, mongoose } = require('../../app');
const supertest = require('supertest');
const request = supertest(app);
const token = process.env.TEST_TOKEN;
const fakeId = '5f924ea593f8c3a37c4efb40';

// jest.setTimeout(9000);

afterAll(async () => mongoose.disconnect());

describe('Test the status code of /tolls', () => {
  it('good behavior and status code for 200', async (done) => {
    let response = await request.get('/tolls').set('x-access-token', token);
    expect(response.status).toBe(200);

    response = await request.post('/tolls').set('x-access-token', token).send(newToll);
    expect(response.status).toBe(201);
    const id = response.body._id;

    response = await request.patch(`/tolls/${id}`).set('x-access-token', token).send({ direction: 1 });
    expect(response.status).toBe(200);

    response = await request.delete(`/tolls/${id}`).set('x-access-token', token);
    expect(response.status).toBe(200);

    done();
  });

  it('for 401 for forbidden test the token for the API', async (done) => {
    let response = await request.get('/tolls');
    expect(response.status).toBe(401);

    response = await request.post('/tolls').send(newToll);
    expect(response.status).toBe(401);

    response = await request.get('/tolls/fake-id').send(newToll);
    expect(response.status).toBe(401);

    response = await request.patch('/tolls/fake-id').send(newToll);
    expect(response.status).toBe(401);

    response = await request.delete('/tolls/fake-id').send(newToll);
    expect(response.status).toBe(401);

    done();
  });

  it('check the code of send missing information', async (done) => {
    response = await request.post('/tolls').set('x-access-token', token).send({ direction: 1 });
    expect(response.status).toBe(400);

    response = await request.post('/tolls').set('x-access-token', token).send(newCar);
    expect(response.status).toBe(400);

    response = await request.post('/tolls').set('x-access-token', token);
    expect(response.status).toBe(400);

    response = await request.patch(`/tolls/${fakeId}`).set('x-access-token', token);
    expect(response.status).toBe(404);

    response = await request.delete(`/tolls/${fakeId}`).set('x-access-token', token);
    expect(response.status).toBe(404);

    done();
  });
});

describe('Test the status code of the each endpoint', () => {
  it('status code for /vehicles post', async (done) => {
    const response = await request.get('/vehicles').set('x-access-token', token);
    expect(response.status).toBe(200);
    done();
  });
});

describe('Test the status code of the each endpoint', () => {
  it('status code for not found enpoint', async (done) => {
    const response = await request.post('/testing').set('x-access-token', token).send(newToll);
    // expect(response.status).toBe(302);
    done();
  });
});

describe('Test the status code of the each endpoint', () => {
  it('status code for the documentation', async (done) => {
    let response = await request.post('/').set('x-access-token', token).send(newToll);
    // expect(response.status).toBe(404);
    response = await request.post('/api-docs').set('x-access-token', token).send(newToll);
    expect(response.status).toBe(200);
    done();
  });
});

describe('Test the status code of the each endpoint', () => {
  it('status code for the init of the page', async (done) => {
    const response = await request.get('/').set('x-access-token', token).send(newToll);
    expect(response.status).toBe(200);
    done();
  });
});

describe('Test the status code of not found pages', () => {
  it('status code for /vehicles post', async (done) => {
    let response = await request.get('/tollss').set('x-access-token', token);
    expect(response.status).toBe(404);

    response = await request.patch('/tolls/not-id').set('x-access-token', token);
    expect(response.status).toBe(404);

    response = await request.delete('/tolls/not-id').set('x-access-token', token);
    expect(response.status).toBe(404);

    done();
  });
});

// describe('Test the status code of the a lot request', () => {
//   it('check the code of send a lot of request', async (done) => {
//     let response = null
//     for (const _ in [...Array(101).keys()]) {
//       response = await request.get('/tolls').set('x-access-token', token);
//     }
//     expect(response.status).toBe(429);
//     console.log(response.body)
//     done();
//   });
// });

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
