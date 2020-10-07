const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vehicles = new Schema({
  category: Number,
  weight: Number,
  axis: Number,
  fuel_type: {
    type: String,
    enum: ['diesel', 'gas']
  },
  features: mongoose.SchemaTypes.Mixed
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

Vehicles.statics.findBySpecification = async function (axis) {
  const vehicles = await this.find({ axis: axis }, { category: 0 });
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
