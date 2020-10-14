const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vehicles = new Schema({
  name: { type:String, required: true },
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
  axis: { type:Number, required: true, min: 2, max: 10 } ,
  fuel_type: {
    type: String,
    enum: ['diesel', 'gas'],
    required: true
  },
  volume: { type: Number },
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
