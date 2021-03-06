const isValid = require('mongoose').Types.ObjectId.isValid;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Vehicles = new Schema({
  name: { type: String, required: true },
  category: {
    group1: { type: Number, required: true },
    group2: { type: Number, required: true },
    group3: { type: Number, required: true }
  },
  typeOf: {
    type: String,
    enum: ['automovil', 'bus', 'camion', 'moto'],
    required: true
  },
  weight: { type: Number, required: true },
  axis: { type: Number, required: true, min: 2, max: 10 },
  literPer100Kilometer: { type: Number, min: 0, max: 100, default: 10 },
  fuel_type: {
    type: String,
    enum: ['diesel', 'gas'],
    required: true
  },
  volume: { type: Number, default: 200 },
  features: { type: Schema.Types.Mixed, default: {} },
  status: { type: Boolean, default: true }
}, { versionKey: false, timestamps: true });

/**
 * This function send a request to our db and create a new vehicle
 * @param {newToll} object The parameter is content of the request to the API, and
 * contain the new vehicle already validated it
 */
Vehicles.statics.createVehicle = async function (vehicle) {
  // the object.keys is for test how long is the object
  if (Object.keys(vehicle).length === 0) return null;

  try {
    return await this.create(vehicle);
  } catch {
    console.log('Schema not valid');
    return null;
  }
};

/**
 * This function send a request to our db and delete by id a vehicle
 * @param {id} string The parameter is the id of the vehicle
 */
Vehicles.statics.deleteVehicle = async function (id) {
  // will check the id of the value
  if (!isValid(id)) { return null; }
  return await this.findByIdAndDelete(id);
};

/**
 * This function is to find a vehicle by id
 * @param {id} string The parameter is the id of the vehicle
 */
Vehicles.statics.findVehicleById = async function (id) {
  let vehicle = null;
  if (mongoose.isValidObjectId(id)) { vehicle = await this.findById(id); }
  return vehicle;
};

/**
 * This function send a request to our db and bringing all vehicle
 */
Vehicles.statics.findAllVehicles = async function () {
  const vehicles = await this.find().sort({ weight: -1 });
  return vehicles;
};

/**
 * This function is to update the vehicle and the characteristic
 * @param {id} string The id of the vehicle
 * @param {data} object The parameter contains the content of the new values of the vehicle
 */
Vehicles.statics.updateVehicles = async function (id, data) {
  let vehicle = null;
  const query = {};
  if (data === undefined || Object.keys(data).length === 0 || data.length === 0) {
    return null;
  }
  if (data._id || data.id) return null;
  for (const key in data) {
    if (typeof (data[key]) === 'object') {
      for (const value in data[key]) {
        query[key + '.' + value] = data[key][value];
      }
    } else {
      query[key] = data[key];
    }
  }
  if (mongoose.isValidObjectId(id)) {
    vehicle = await this.findByIdAndUpdate(id,
      { $set: query }, { new: true });
  }
  return vehicle;
};

/**
 * This function send a request to our db and bringging the vehicle by the name
 * @param {name} string Is a variable to bringging the validated vehicle in the company
 */
Vehicles.statics.findBySpecification = async function (name) {
  const vehicles = await this.find({ name: name });
  return vehicles;
};

/**
 * This function erases the characteristics of a car by the id,
 * the characteristics are calculated by kilometer per hour
 * @param {id} string The id of the vehicle
 * @param {features} object The parameter contains the content of the new values of the vehicle
 */
Vehicles.statics.deleteFeaturesById = async function (id, features) {
  let vehicle = null;
  const query = {};
  if (features === undefined || Object.keys(features).length === 0) {
    return null;
  }
  if (features._id || features.id) return null;

  for (const key in features) {
    if (key !== 'tires') {
      query['features.' + key] = 1;
    }
  }

  if (mongoose.isValidObjectId(id)) {
    console.log(query);
    vehicle = await this.findByIdAndUpdate(id, { $unset: query }, { new: true });
  }
  return vehicle;
};

/**
 * This function update and add the characteristics of a car by the id,
 * the characteristics are calculated by kilometer per hour
 * @param {id} string The id of the vehicle
 * @param {features} object The parameter contains the content of the new values of the vehicle
 */
Vehicles.statics.updateFeaturesByid = async function (id, features) {
  let vehicle = null;
  const query = {};
  if (features === undefined || Object.keys(features).length === 0) {
    return null;
  }
  if (features._id || features.id) return null;

  for (const key in features) {
    query['features.' + key] = features[key];
  }

  if (mongoose.isValidObjectId(id)) {
    vehicle = await this.findByIdAndUpdate(id, { $set: query }, { new: true });
  }
  return vehicle;
};

/**
 * This function update the characteristics of all vehicles,
 * the characteristics are calculated by kilometer per hour
 * @param {id} string The id of the vehicle
 * @param {features} object The parameter contains the content of the new values of the vehicle
 */
Vehicles.statics.updateWholeVehicles = async function (data) {
  const query = {};
  // if (data === undefined || Object.keys(data).length === 0) return null;

  for (const key in data) {
    query['features.' + key] = data[key];
  }
  return this.updateMany({}, { $set: query }, { multi: true });
};

module.exports = mongoose.model('Vehicles', Vehicles);
