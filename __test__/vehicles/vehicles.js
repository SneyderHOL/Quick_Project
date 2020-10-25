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

    // const newCartest = {
    //   name: 'test',
    //   coordinates: {
    //     dest: 1.1
    //   },
    //   costs: {
    //     I: 1000
    //   }
    // };
    // const test = await request.post('/vehicles').send(newCartest);
    // expect(test.status).toBe(201);

    done();
  });

  it('test the endpoint /vehicles for catch errors', async (done) => {
    // const responseError = 'Send the complete information, missing coordinates or the name of toll';

    // const responseTwo = await request.post('/vehicles').send({});
    // expect(Object.is(responseTwo.body.error, responseError)).toBe(true);
    // expect(responseTwo.status).toBe(400);

    // const responseThree = await request.post('/vehicles').send('This is not a json');
    // expect(Object.is(responseThree.body.error, 'Server requires application/json')).toBe(true);
    // expect(responseThree.status).toBe(400);

    // const responseFour = await request.post('/vehicles').send({ name: 'Nice' });
    // expect(Object.is(responseFour.body.error, responseError)).toBe(true);
    // expect(responseFour.status).toBe(400);

    // const newCartest = {
    //   name: 'test',
    //   coordinates: {
    //     dest: 1.1
    //   },
    //   costs: {}
    // };
    // const responseFive = await request.post('/vehicles').send(newCartest);
    // expect(Object.is(responseFive.body.error, 'Please give costs of vehicles')).toBe(true);
    // expect(responseFive.status).toBe(400);

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

// PATCH /vehicles/id
// describe('Test update vehicles of the endpoint /vehicles', () => {
//   it('test the endpoint /vehicles for good behavior', async (done) => {
//     const response = await request.get('/vehicles');
//     const body = response.body.data.vehicles[1];
//     // const testCar = {
//     //   name: uuidv4(),
//     //   newAttribute: true
//     // };
//     const testCar = {
//       name: uuidv4()
//     };
//     let update = await request.patch(`/vehicles/${body._id}`).send(testCar);
//     expect(update.status).toBe(200);
//     expect(body._id).not.toBe(update.body.id);
//     expect(update.body.newAttribute).toBeUndefined();

//     done();
//   });

//   it('test the endpoint /vehicles for catch errors', async (done) => {
//     const r = await request.get('/vehicles');
//     expect(r.status).toBe(200);
//     const body = r.body.data.vehicles;
//     let update = null
//     let response = await request.patch(`/vehicles/noid`).send({});
//     expect(response.status).toBe(404);
//     // expect(response.body.error).toBe('Toll Not found')
//     const oldTold = body[2];
//     let toll = body[2];
//     const testA = {
//       testOne: {
//         direction: 1
//       },
//       testTwo: {
//         department: 'MEXICO',
//       },
//       testThree: {
//         coordinates: {
//           lat: 3.449598,
//           lng: -76.520473
//         }
//       },
//       testFour: { costs: { I: 16800 } }
//     };

//     response = await request.patch(`/vehicles/${toll._id}`).send({});
//     expect(response.status).toBe(200);

//     update = await request.patch(`/vehicles/${toll._id}`).send(testA.testOne);
//     expect(update.body.direction).toBe(testA.testOne.direction);
//     expect(update.status).toBe(200);

//     update = await request.patch(`/vehicles/${toll._id}`).send(testA.testTwo);
//     expect(update.body.department).toBe(testA.testTwo.department);
//     // expect(update.body.department).not.toBe(oldTold.department)

//     update = await request.patch(`/vehicles/${toll._id}`).send(testA.testFour);
//     expect(update.body.costs).toMatchObject(testA.testFour.costs);
//     // expect(update.body.costs).not.toMatchObject(oldTold.costs);

//     // request.patch(`/vehicles/${bodyfive._id}`).send(testCarfive);
//     // update = await request.get(`/vehicles/${bodyfive._id}`);
//     // expect(update.body.coordinates).toMatchObject(testCarfive.coordinates);
//     // expect(newCar.coordinates).not.toMatchObject(update.coordinates);

//     //   operator: 'INCO'
//     //   status: true,
//     //   group: 2

//     done();
//   });
// });

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

  // it('test the endpoint /vehicles for catch errors', async (done) => {
  //   const r = await request.get('/vehicles');
  //   const body = r.body.data.vehicles[4];
  //   const response = await request.patch(`/vehicles/${body._id}`).send({});
  //   expect(response.status).toBe(200);
  //   // expect(Object.is(response.body.error, 'Bad Request, please send complete information')).toBe(true);
  //   done();
  // });
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

//   try {
//   const response = await request.post("/vehicles").send({
//   name: "testing",
//   coordenates: { lat: 12.2, lng: 123.2 },
//   operator: "J",
//   direction: 0,
//   toll_cost: {"x": 1},
//   department: 'cali'
// });
// console.log(response.status)
// expect(response.status).toBe(201);
// } catch (e) {
//     // have to manually handle the failed test with "done.fail"
//     done.fail(e)
//   }
// expect(response.body.message).toBe("pass!");

// done()

// const supertest = require('supertest');
// const app = require('../app');

// const { v4: uuidv4 } = require('uuid');

// describe("Testing the movies API", () => {

// 	// it("tests the base route and returns true for status", async () => {

// 	// 	const response = await supertest(app).get('/');

// 	// 	expect(response.status).toBe(200);
// 	// 	expect(response.body.status).toBe(true);

// 	// });
//   afterAll(async () => {
//   if (app) {
//     await app.close();
//   }
//   });

//   it('status code for /vehicles get', async (done) => {
//     const response = await .get('/vehicles');
//     expect(response.status).toBe(200);
//     // expect(response.body.status).toBe(true);
//     done();
//   });

// });

// describe('Test the status code of the each endpoint', () => {

//   it('status code for /vehicles post', async (done) => {
//     const response = await request.post('/vehicles').send(newCar);
//     expect(response.status).toBe(201);
//     done();
//   });

//   it('status code for not found enpoint', async (done) => {
//     const response = await request.post('/testing').send(newCar);
//     expect(response.status).toBe(302);
//     done();
//   });

//   it('status code redirect to documentation', async (done) => {
//     const response = await request.post('/').send(newCar);
//     expect(response.status).toBe(302);
//     done();
//   });

//   it('status code for the documentation', async (done) => {
//     const response = await request.post('-docs').send(newCar);
//     expect(response.status).toBe(200);
//     done();
//   });

//   it('status code for the init of the page', async (done) => {
//     const response = await request.get('/').send(newCar);
//     expect(response.status).toBe(200);
//     done();
//   });
// });

// const newCar = {
//   coordinates: {
//     lat: 0,
//     lng: -1
//   },
//   direction: 0,
//   department: 'ANTIOQUIA',
//   name: 'Testing with base',
//   operator: 'INCO',
//   costs: {
//     I: 16800,
//     II: 19000,

//     III: 41400,
//     IV: 53900,
//     V: 64500
//   },
//   status: true,
//   group: 2
// };

// // POST /vehicles
// describe('Test create vehicles of the endpoint /vehicles', () => {

//   it('test the endpoint /vehicles for good behavior', async (done) => {
//     const response = await request.post('/vehicles').send(newCar);
//     expect(response.status).toBe(201);
//     expect(response.headers['content-type']).toMatch(/application\/json/);
//     delete response.body._id;
//     delete response.body.update_at;
//     expect(response.body).toMatchObject(newCar);

//     const newCartest = {
//       coordinates: {
//         lat: 6.32613,
//         lng: -75.68854
//       },
//       direction: 0,
//       department: "ANTIOQUIA",
//       status: true,
//       group: 2,
//       name: "Túnel de Occidente",
//       operator: "INCO",
//       costs: {
//         I: 16800,
//         II: 19000,
//         III: 41400,
//         IV: 53900,
//         V: 64500
//       }
//     };
//     const test = await request.post('/vehicles').send(newCartest).end(done);
//     expect(test.status).toBe(201).end(done);;

//     done();
//   });

//   it('test the endpoint /vehicles for catch errors', async (done) => {
//     const responseTwo = await request.post('/vehicles').send({}).end(done);

//     expect(Object.is(responseTwo.body.error, 'Bad request')).toBe(true).end(done);
//     expect(responseTwo.status).toBe(400).end(done);

//     const responseThree = await request.post('/vehicles').send('This is not a json').end(done);

//     expect(Object.is(responseThree.body.error, 'Server requires application/json')).toBe(true).end(done);
//     expect(responseThree.status).toBe(400).end(done);

//     const responseFour = await request.post('/vehicles').send({ name: 'Nice' }).end(done);
//     expect(Object.is(responseFour.body.error, 'Bad request')).toBe(true).end(done);
//     expect(responseFour.status).toBe(422).end(done);

//     const newCartest = {
//       name: 'test',
//       coordinates: {
//         dest: 1.1
//       },
//       costs: {}
//     };
//     const responseFive = await request.post('/vehicles').send(newCartest).end(done);
//     expect(Object.is(responseFive.body.error, 'Bad request')).toBe(true).end(done);
//     expect(responseFive.status).toBe(422).end(done);

//     done();
//   });
// });

// // GET /vehicles
// describe('Test read vehicles of the endpoint /vehicles', () => {
//   it('test the endpoint /vehicles for good behavior', async (done) => {
//     const response = await request.get('/vehicles').end(done);
//     expect(response.status).toBe(200).end(done);

//     const responseTwo = await request.get('/vehicles').send({ name: 'testing' }).end(done);
//     expect(responseTwo.status).toBe(200).end(done);
//     done();
//   });
// });

// // PATCH /vehicles/id
// describe('Test update vehicles of the endpoint /vehicles', () => {
//   it('test the endpoint /vehicles for good behavior', async (done) => {
//     const response = await request.get('/vehicles').end(done);
//     const body = response.body.data.vehicles[1];
//     const testCar = {
//       name: uuidv4(),
//       newAttribute: true
//     };
//     const update = await request.patch(`/vehicles/${body._id}`).send(testCar).end(done);
//     expect(update.body.status).toBe(200).end(done).end(done);
//     expect(body._id).not.toBe(update.body.id).end(done);
//     expect(update.body.body.newAttribute).toBeUndefined().end(done);
//     done();
//   });

//   it('test the endpoint /vehicles for catch errors', async (done) => {
//     const r = await request.get('/vehicles').end(done);
//     const body = r.body.data.vehicles[4];
//     const response = await request.patch(`/vehicles/${body._id}`).send({}).end(done);
//     expect(response.status).toBe(400).end(done);
//     expect(Object.is(response.body.error, 'Bad request')).toBe(true).end(done);
//     done();
//   });
// });

// // DELETE /vehicles/id
// describe('Test delete vehicles of the endpoint /vehicles', () => {
//   it('test the endpoint /vehicles for good behavior', async (done) => {
//     const response = await request.post('/vehicles').send(newCar).end(done);
//     const body = await request.delete(`/vehicles/${response.body._id}`).send(newCar).end(done);
//     expect(body.status).toBe(204).end(done);
//     const validated = await request.get(`/vehicles/${response.body._id}`).end(done);
//     expect(validated.status).toBe(404).end(done);
//     expect(validated.body.error).toBe('Toll Not Found').end(done);
//     done();
//   });

//   it('test the endpoint /vehicles for catch errors', async (done) => {
//     const r = await request.get('/vehicles').end(done);
//     const body = r.body.data.vehicles[4];
//     const response = await request.patch(`/vehicles/${body._id}`).send({}).end(done);
//     expect(response.status).toBe(400).end(done);
//     expect(Object.is(response.body.error, 'Bad request')).toBe(true).end(done);
//     done();
//   });
// });

// describe('Test the status code of the each endpoint', () => {
//   it('status code for /vehicles get', async (done) => {
//     const response = await request.get('/vehicles').end(done);
//     expect(response.status).toBe(200).end(done);
//     done();
//   });
//   it('status code for /vehicles post', async (done) => {
//     const response = await request.post('/vehicles').send(newCar).end(done);
//     expect(response.status).toBe(201).end(done);
//     done();
//   });

//   it('status code for not found enpoint', async (done) => {
//     const response = await request.post('/testing').send(newCar).end(done);
//     expect(response.status).toBe(302).end(done);
//     done();
//   });

//   it('status code redirect to documentation', async (done) => {
//     const response = await request.post('/').send(newCar).end(done);
//     expect(response.status).toBe(302).end(done);
//     done();
//   });

//   it('status code for the documentation', async (done) => {
//     const response = await request.post('-docs').send(newCar).end(done);
//     expect(response.status).toBe(200).end(done);
//     done();
//   });

//   it('status code for the init of the page', async (done) => {
//     const response = await request.get('/').send(newCar).end(done);
//     expect(response.status).toBe(200).end(done);
//     done();
//   });
// it('status code for /vehicles get', async (done) => {
//   const response = await request.get('/vehicles');
//   expect(response.status).toBe(200);
//   done();
// });
// it('status code for /vehicles post', async (done) => {
//   const response = await request.post('/vehicles').send(newVehicles);
//   expect(response.status).toBe(201);
//   done();
// });
// });

// describe('Test the status code of the each endpoint', () => {

// it('status code for not found enpoint', async (done) => {
//   const response = await request.post('/testing').send(newVehicles);
//   expect(response.status).toBe(302);
//   done();
// });

// it('status code redirect to documentation', async (done) => {
//   const response = await request.post('/').send(newVehicles);
//   expect(response.status).toBe(302);
//   done();
// });

// it('status code for the documentation', async (done) => {
//   const response = await request.post('-docs').send(newVehicles);
//   expect(response.status).toBe(200);
//   done();
// });

// it('status code for the init of the page', async (done) => {
//   const response = await request.get('/').send(newVehicles);
//   expect(response.status).toBe(200);
//   done();
// });
// });

// // POST /api/vehicles
// describe('Test create (C) vehicles of the endpoint /api/vehicles', () => {
//   it('test the endpoint /api/vehicles for good behavior', async (done) => {
//     const response = await request.post('/api/vehicles').send(newVehicles);
//     expect(response.status).toBe(201);
//     expect(response.headers['content-type']).toMatch(/application\/json/);
//     delete response.body._id;
//     expect(response.body).toMatchObject(newVehicles);

//     const newVehiclestest = {
//       name: "rayo",
//       category: {
//         group1: 4,
//         group2: 4,
//         group3: 4
//       },
//       axis: 3,
//       typeOf: 'automovil',
//       fuel_type: 'gas',
//       weight: 34
//     };
//     const test = await request.post('/api/vehicles').send(newVehiclestest);
//     expect(test.status).toBe(201);
//     expect(test.body).not.toBeNull()

//     done();
//   });

//   it('test the endpoint /api/vehicles for catch errors', async (done) => {
//     const responseone = await request.post('/api/vehicles').send("New");
//     expect(Object.is(responseone.body.error, 'Server requires application/json')).toBe(true);
//     expect(responseone.status).toBe(400);
//     const validateVehicle = {}

//     const responseTwo = await request.post('/api/vehicles').send(validateVehicle);
//     expect(Object.is(responseTwo.body.error, 'Bad request')).toBe(true);
//     expect(responseTwo.status).toBe(400);

//     validateVehicle.name = "nice"
//     const responseFour = await request.post('/api/vehicles').send(validateVehicle);
//     expect(Object.is(responseFour.body.error, 'Bad request')).toBe(true);
//     expect(responseFour.status).toBe(422);

//     validateVehicle.category = {}
//     const responsefive = await request.post('/api/vehicles').send(validateVehicle);
//     expect(Object.is(responsefive.body.error, 'Bad request')).toBe(true);
//     expect(responsefive.status).toBe(422);

//     validateVehicle.category = { group1: 1, group2: 1, group3: 2 };
//     const responsesix = await request.post('/api/vehicles').send(validateVehicle);
//     expect(Object.is(responsesix.body.error, 'Bad request')).toBe(true);
//     expect(responsesix.status).toBe(422);

//     validateVehicle.typeOf = 'Bus'
//     const responseseven = await request.post('/api/vehicles').send(validateVehicle);
//     expect(Object.is(responseseven.body.error, 'Bad request')).toBe(true);
//     expect(responseseven.status).toBe(422);

//     validateVehicle.operator = ''
//     const responseeight = await request.post('/api/vehicles').send(validateVehicle);
//     expect(Object.is(responseeight.body.error, 'Bad request')).toBe(true);
//     expect(responseeight.status).toBe(422);

//     validateVehicle.axis = 10
//     const responsenine = await request.post('/api/vehicles').send(validateVehicle);
//     expect(Object.is(responsenine.body.error, 'Bad request')).toBe(true);
//     expect(responsenine.status).toBe(422);

//     validateVehicle.fuel_type = 'gas'
//     const responseten = await request.post('/api/vehicles').send(validateVehicle);
//     expect(Object.is(responseten.body.error, 'Bad request')).toBe(true);
//     expect(responseten.status).toBe(422);

//     validateVehicle.weight = 34
//     // correct functionality of the vehicle
//     const responseeleven = await request.post('/api/vehicles').send(validateVehicle);
//     expect(responseeleven.status).toBe(200);

//     validateVehicle.nulll = 34
//     // correct functionality of the vehicle
//     const response = await request.post('/api/vehicles').send(validateVehicle);
//     expect(response.status).toBe(200);
//     expect(response.nulll).toBeNull();

//     // validateVehicle.typeOf = 'ferrari'
//     // const responsetwelve = await request.post('/api/vehicles').send(validateVehicle);
//     // expect(Object.is(responsetwelve.body.error, 'Bad request')).toBe(true);
//     // expect(responsetwelve.status).toBe(422);
//     // validateVehicle.typeOf = 'camion'

//     // validateVehicle.axis = 11;
//     // const responsefourten = await request.post('/api/vehicles').send(validateVehicle);
//     // expect(Object.is(responsefourten.body.error, 'Bad request')).toBe(true);
//     // expect(responsefourten.status).toBe(422);
//     // validateVehicle.axis = 0;
//     done();
//   });
// });

// GET /api/vehicles
// describe('Test read vehicles of the endpoint /api/vehicles', () => {
//   it('test the endpoint /api/vehicles for good behavior', async (done) => {
//     const response = await request.get('/api/vehicles');
//     expect(response.status).toBe(200);

//     const responseTwo = await request.get('/api/vehicles').send({ name: 'testing' });
//     expect(responseTwo.status).toBe(200);
//     done();
//   });
// });

// // PATCH /api/vehicles/id
// describe('Test update vehicles of the endpoint /api/vehicles', () => {
//   it('test the endpoint /api/vehicles for good behavior', async (done) => {
//     const response = await request.get('/api/vehicles');
//     const body = response.body.vehicles[1];
//     const newVehicles = { name: uuidv4() };
//     const update = await request.patch(`/api/vehicles/${body._id}`).send(newVehicles);
//     expect(update.status).toBe(200);
//     expect(body._id).not.toBe(update.body.id);
//     expect(update.body.newAttribute).toBeUndefined();
//     done();
//   });

//   it('test the endpoint /api/vehicles for catch errors', async (done) => {
//     const r = await request.get('/api/vehicles');
//     const body = r.body.vehicles[4];
//     const response = await request.patch(`/api/vehicles/${body._id}`).send({});
//     expect(response.status).toBe(400);
//     expect(Object.is(response.body.error, 'Bad Request')).toBe(true);
//     done();
//   });
// });

// // DELETE /api/vehicles/id
// describe('Test delete vehicles of the endpoint /api/vehicles', () => {
//   it('test the endpoint /api/vehicles for good behavior', async (done) => {
//     const response = await request.post('/api/vehicles').send(newVehicles);
//     const body = await request.delete(`/api/vehicles/${response.body._id}`).send(newVehicles);
//     expect(body.status).toBe(204);
//     const validated = await request.get(`/api/vehicles/${response.body._id}`);
//     expect(validated.status).toBe(404);
//     expect(validated.body.error).toBe('Not Found');
//     done();
//   });

//   it('test the endpoint /api/vehicles for catch errors', async (done) => {
//     const r = await request.get('/api/vehicles');
//     const body = r.body.vehicles[4];
//     const response = await request.patch(`/api/vehicles/${body._id}`).send({});
//     expect(response.status).toBe(400);
//     expect(Object.is(response.body.error, 'Bad Request')).toBe(true);
//     done();
//   });
// });
