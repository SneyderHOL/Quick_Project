const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

jest.setTimeout(5000);
const mongod = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
  const uri = await mongod.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    // autoReconnect: true,
    // reconnectTries: Number.MAX_VALUE,
    // reconnectInterval: 1000,
    useUnifiedTopology: false,
    useFindAndModify: false,
    useUnifiedTopology: true
  };

  await mongoose.connect(uri, mongooseOpts);
};

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
