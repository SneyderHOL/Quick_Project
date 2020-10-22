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
  fuel_type: {
    type: String,
    enum: ['diesel', 'gas'],
    required: true
  },
  volume: { type: Number },
  features: { type: mongoose.SchemaTypes.Mixed, default: null },
  status: { type: Boolean, default: true }
}, { versionKey: false, timestamps: true });

Vehicles.statics.createVehicle = async function (vehicle) {
  const vehicles = await this.create(vehicle);
  return vehicles;
};

Vehicles.statics.deleteVehicle = async function (id) {
  // will check the id of the value
  if (!isValid(id)) { return null; }
  return await this.findByIdAndDelete(id);
};

Vehicles.statics.findVehicleById = async function (id) {
  let vehicle = null;
  if (mongoose.isValidObjectId(id)) { vehicle = await this.findById(id); }
  return vehicle;
};

Vehicles.statics.findAllVehicles = async function () {
  const vehicles = await this.find();
  return vehicles;
};

Vehicles.statics.updateVehicles = async function (id, data) {
  let vehicle = null;
  const query = {};
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
    vehicle = await this.findByIdAndUpdate(id, { $set: query }, { new: true });
  }
  return vehicle;
};
/*
Vehicles.statics.updateVehicles = async function (id, vehicle) {
  const v = await this.findByIdAndUpdate(id, vehicle, { new: true });
  return v;
};
*/
Vehicles.statics.findBySpecification = async function (name) {
  const vehicles = await this.find({ name: name });
  return vehicles;
};

module.exports = mongoose.model('Vehicles', Vehicles);
