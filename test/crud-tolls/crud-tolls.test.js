const dbHandler = require('../jest-mongodb-config');




describe('Test create tolls of the endpoint /api/tolls', () => {

  it("Should", async done => {
    const res = await request.post("/signup").send({
      name: "Zell",
      email: "testing@gmail.com"
    });
    done();
  });

});

    try {
    const response = await request.post("/api/tolls").send({
    name: "testing",
    coordenates: { lat: 12.2, lng: 123.2 },
    operator: "J",
    direction: 0,
    toll_cost: {"x": 1},
    department: 'cali'
  });
  console.log(response.status)
  expect(response.status).toBe(201);
  } catch (e) {
      // have to manually handle the failed test with "done.fail"
      done.fail(e)
    }
  expect(response.body.message).toBe("pass!");

  done()


