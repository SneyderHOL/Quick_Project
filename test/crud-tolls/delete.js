const app = require("../../app");
const supertest = require("supertest");
const request = supertest(app);
const { setupDB } = require("../test-setup");
const { nameDb, passwdDb, dbName } = require('../../config')
const mongoose = require("mongoose");

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

const test = async (done) => {
  const response = await request.get("/api/tolls");
  console.log(response.status === 200)
  console.log(response.body)

}




    // Test Schema is working!!!
    // You shouldn't be able to add in any field that isn't defined in the schema
    it('insert user successfully, but the field does not defined in schema should be undefined', async () => {
        const userWithInvalidField = new UserModel({ name: 'TekLoon', gender: 'Male', nickname: 'Handsome TekLoon' });
        const savedUserWithInvalidField = await userWithInvalidField.save();
        expect(savedUserWithInvalidField._id).toBeDefined();
        expect(savedUserWithInvalidField.nickkname).toBeUndefined();
    });

    // Test Validation is working!!!
    // It should us told us the errors in on gender field.
    it('create user without required field should failed', async () => {
        const userWithoutRequiredField = new UserModel({ name: 'TekLoon' });
        let err;
        try {
            const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
            error = savedUserWithoutRequiredField;
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.gender).toBeDefined();
    });
