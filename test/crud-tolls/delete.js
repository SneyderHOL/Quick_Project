// // const app = require("../../app");
// // const supertest = require("supertest");
// // const request = supertest(app);
// // // const { setupDB } = require("../test-setup");
// // const { nameDb, passwdDb, dbName } = require('../../config')
// // const mongoose = require("mongoose");

// // // Setup a Test Database


// // // it("Should save user to database", async done => {
// // //   const res = await request.post("/signup").send({
// // //     name: "Zell",
// // //     email: "testing@gmail.com"
// // //   });
// // //   done();
// // // });

// // const { setupDB } = require("../test-setup");

// // // Setup a Test Database
// // setupDB();


// // it("test endpoint create", async done => {
// //   const url = `mongodb+srv://${nameDb}:${passwdDb}@` +
// //     `cluster0.rq3kf.mongodb.net/${dbName}?retryWrites=true&w=majority`
// //   await mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
// //   const db = await mongoose.connection;
// //   db.on('error', console.error.bind(console, 'connection error:'));


// //     try {
// //     const response = await request.post("/api/tolls").send({
// //     name: "testing",
// //     coordenates: { lat: 12.2, lng: 123.2 },
// //     operator: "J",
// //     direction: 0,
// //     toll_cost: {"x": 1},
// //     department: 'cali'
// //   });
// //   // console.log(response.status)
// //   expect(response.status).toBe(201);
// //   } catch (e) {
// //       // have to manually handle the failed test with "done.fail"
// //       done.fail(e)
// //     }
// //   // expect(response.body.message).toBe("pass!");

// //   done();
// // });

// // // afterAll(async () => {
// // //   await dropAllCollections();
// // //   await mongoose.connection.close();
// // // });



// // // const test = async (done) => {
// // //   const response = await request.get("/api/tolls");
// // //   console.log(response.status === 200)
// // //   console.log(response.body)

// // // }

// // // test()



// // // const mongoDB = 'mongodb://localhost:/test';
// // // const mongoose = require('mongoose');

// // // const Schema = mongoose.Schema;


// // // const userSchema = new Schema({
// // //   name: String,
// // //   email: {
// // //     type: String,
// // //     require: true,
// // //     unique: true
// // //   }
// // // });

// // // module.exports = mongoose.model("User", userSchema);


// // // mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
// // // mongoose.Promise = global.Promise;
// // // const db = mongoose.connection;
// // // db.on('error', console.error.bind(console, 'connection error:'));

// // // const beforeEach = async () => {
// // //   await userSchema.create({name: 'yo', email:'andressa@gmail.com'});
// // // };


// // // beforeEach()

// // // db.close();


// const mongoose = require('mongoose');
// const UserModel = require('../../src/models/user');
// const userData = { name: 'TekLoon', gender: 'Male', dob: new Date(), loginUsing: 'Facebook' };

// describe('User Model Test', () => {

//     // It's just so easy to connect to the MongoDB Memory Server
//     // By using mongoose.connect
//     beforeAll(async () => {
//         await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
//             if (err) {
//                 console.error(err);
//                 process.exit(1);
//             }
//         });
//     });

//     it('create & save user successfully', async () => {
//         const validUser = new UserModel(userData);
//         const savedUser = await validUser.save();
//         // Object Id should be defined when successfully saved to MongoDB.
//         expect(savedUser._id).toBeDefined();
//         expect(savedUser.name).toBe(userData.name);
//         expect(savedUser.gender).toBe(userData.gender);
//         expect(savedUser.dob).toBe(userData.dob);
//         expect(savedUser.loginUsing).toBe(userData.loginUsing);
//     });

//     // // Test Schema is working!!!
//     // // You shouldn't be able to add in any field that isn't defined in the schema
//     // it('insert user successfully, but the field does not defined in schema should be undefined', async () => {
//     //     const userWithInvalidField = new UserModel({ name: 'TekLoon', gender: 'Male', nickname: 'Handsome TekLoon' });
//     //     const savedUserWithInvalidField = await userWithInvalidField.save();
//     //     expect(savedUserWithInvalidField._id).toBeDefined();
//     //     expect(savedUserWithInvalidField.nickkname).toBeUndefined();
//     // });

//     // // Test Validation is working!!!
//     // // It should us told us the errors in on gender field.
//     // it('create user without required field should failed', async () => {
//     //     const userWithoutRequiredField = new UserModel({ name: 'TekLoon' });
//     //     let err;
//     //     try {
//     //         const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
//     //         error = savedUserWithoutRequiredField;
//     //     } catch (error) {
//     //         err = error
//     //     }
//     //     expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
//     //     expect(err.errors.gender).toBeDefined();
//     // });
// })


