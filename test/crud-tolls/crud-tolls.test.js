const app = require('../../app')
const supertest = require("supertest");
const request = supertest(app);
const { v4: uuidv4 } = require('uuid');

// POST /api/tolls
describe('Test create tolls of the endpoint /api/tolls', () => {
  it("test the endpoint /api/tolls for good behavior", async (done) => {
    const response = await request.post("/api/tolls").send(newToll);
    expect(response.status).toBe(201);
    expect(response.headers['content-type']).toMatch(/application\/json/)
    delete response.body._id
    delete response.body.update_at
    expect(response.body).toMatchObject(newToll);

    const newTolltest = {
      name: "test",
      coordinates: {
        dest: 1.1
      },
      costs: {
        "I": 1000
      }
    }
    const test = await request.post("/api/tolls").send(newTolltest)
    expect(test.status).toBe(201);

    done();
  });

  it("test the endpoint /api/tolls for catch errors", async (done) => {
    const responseError = 'Send the complete information, missing coordinates or the name of toll'

    const responseTwo = await request.post("/api/tolls").send({});
    expect(Object.is(responseTwo.body.error, responseError)).toBe(true)
    expect(responseTwo.status).toBe(400);

    const responseThree = await request.post("/api/tolls").send("This is not a json");
    expect(Object.is(responseThree.body.error, 'Server requires application/json')).toBe(true)
    expect(responseThree.status).toBe(400);

    const responseFour = await request.post("/api/tolls").send({name: "Nice"});
    expect(Object.is(responseFour.body.error, responseError)).toBe(true)
    expect(responseFour.status).toBe(400);

    const newTolltest = {
      name: "test",
      coordinates: {
        dest: 1.1
      },
      costs: {}
    }
    const responseFive = await request.post("/api/tolls").send(newTolltest);
    expect(Object.is(responseFive.body.error, 'Please give costs of tolls')).toBe(true)
    expect(responseFive.status).toBe(400);

    done();
  });

});

// GET /api/tolls
describe('Test read tolls of the endpoint /api/tolls', () => {
  it("test the endpoint /api/tolls for good behavior", async (done) => {
    const response = await request.get("/api/tolls");
    expect(response.status).toBe(200);

    const responseTwo = await request.get("/api/tolls").send({name: 'testing'});
    expect(responseTwo.status).toBe(200);
    done();
  });
});

// PATCH /api/tolls/id
describe('Test update tolls of the endpoint /api/tolls', () => {
  it("test the endpoint /api/tolls for good behavior", async (done) => {
    const response = await request.get("/api/tolls");
    const body = response.body.data.tolls[1]
    const testToll = {
      name: uuidv4(),
      newAttribute: true
    }
    const update = await request.patch(`/api/tolls/${body._id}`).send(testToll);
    expect(update.status).toBe(200);
    expect(body._id).not.toBe(update.body.id)
    expect(update.body.newAttribute).toBeUndefined();
    done();
  });

  it("test the endpoint /api/tolls for catch errors", async (done) => {
    const r = await request.get("/api/tolls");
    const body = r.body.data.tolls[4]
    const response = await request.patch(`/api/tolls/${body._id}`).send({});
    expect(response.status).toBe(400);
    expect(Object.is(response.body.error, 'Bad Request, please send complete information')).toBe(true);
    done();
  });
});

// DELETE /api/tolls/id
describe('Test delete tolls of the endpoint /api/tolls', () => {
  it("test the endpoint /api/tolls for good behavior", async (done) => {
    const response = await request.post("/api/tolls").send(newToll);
    const body = await request.delete(`/api/tolls/${response.body._id}`).send(newToll);
    expect(body.status).toBe(204)
    const validated = await request.get(`/api/tolls/${response.body._id}`)
    expect(validated.status).toBe(404)
    expect(validated.body.error).toBe('Not Found')
    done();
  });

  it("test the endpoint /api/tolls for catch errors", async (done) => {
    const r = await request.get("/api/tolls");
    const body = r.body.data.tolls[4]
    const response = await request.patch(`/api/tolls/${body._id}`).send({});
    expect(response.status).toBe(400);
    expect(Object.is(response.body.error, 'Bad Request, please send complete information')).toBe(true);
    done();
  });
});





describe('Test the status code of the each endpoint', () => {
  it("status code for /api/tolls get", async (done) => {
    const response = await request.get("/api/tolls");
    expect(response.status).toBe(200);
    done();
  });
  it("status code for /api/tolls post", async (done) => {
    const response = await request.post("/api/tolls").send(newToll);
    expect(response.status).toBe(201);
    done();
  });

  it("status code for not found enpoint", async (done) => {
    const response = await request.post("/api/testing").send(newToll);
    expect(response.status).toBe(302);
    done();
  });

  it("status code redirect to documentation", async (done) => {
    const response = await request.post("/api/").send(newToll);
    expect(response.status).toBe(302);
    done();
  });

  it("status code for the documentation", async (done) => {
    const response = await request.post("/api-docs").send(newToll);
    expect(response.status).toBe(200);
    done();
  });

  it("status code for the init of the page", async (done) => {
    const response = await request.get("/").send(newToll);
    expect(response.status).toBe(200);
    done();
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
  "status": true,
  "group": 2
};



  //   try {
  //   const response = await request.post("/api/tolls").send({
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
