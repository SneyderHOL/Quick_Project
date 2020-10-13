const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vehicles = new Schema({
  // aprueba mientras sneider lo aprueba puede que no lo haga lo mas seguro es que no lo haga
  name: String,
  category: {
    group1: Number,
    group2: Number,
    group3: Number
  },
  typeOf: {
    type: String,
    enum: ['automovil', 'bus', 'camion', 'moto']
  },
  weight: Number,
  axis: Number,
  fuel_type: {
    type: String,
    enum: ['diesel', 'gas']
  },
  volume: Number,
  features: { type: mongoose.SchemaTypes.Mixed, default: null },
  state: { type: Boolean, default: true }
}, { versionKey: false });

Vehicles.statics.createVehicle = async (vehicle) => {
  const v = await Vehicles.create({ ...vehicle });
  return v;
};

Vehicles.statics.findAllVehicles = async function () {
  const vehicles = await this.find();
  return vehicles;
};

Vehicles.statics.findVehicleById = async function (id) {
  const vehicles = await this.findById(id);
  return vehicles;
};

Vehicles.statics.findBySpecification = async function (name) {
  const vehicles = await this.find({ name: name });
  return vehicles;
};

Vehicles.statics.updateVehicles = async function (id, vehicle) {
  const v = await this.findByIdAndUpdate(id, vehicle, { new: true });
  return v;
};

Vehicles.statics.deleteVehicle = async function (id) {
  await this.findByIdAndDelete(id);
};

module.exports = mongoose.model('Vehicles', Vehicles);
