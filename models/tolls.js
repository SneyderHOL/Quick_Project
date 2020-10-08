const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TollSchema = new Schema({
  name: String,
  coordinates: { lat: Number, lng: Number },
  operator: String,
  direction: { type: Number, default: 0 },
  costs: mongoose.SchemaTypes.Mixed,
  update_at: { type: Date, default: Date.now },
  department: { type: String, default: '' },
  id: Number,
  status: { type: Boolean, default: true },
  group: { type: Number, default: 2 }
}, { versionKey: false });

// check this function
TollSchema.statics.createToll = async function (toll) {
  if (Object.keys(toll).length === 0) {
    return null
  }
  return await this.create(toll);
};

TollSchema.statics.deleteToll = async function (id) {
  await this.findByIdAndDelete(id);
};

TollSchema.statics.findTollById = async function (id, callback) {
  var toll = null;
  if (mongoose.isValidObjectId(id)) {
    toll = await this.findById(id).exec();
  }
  return toll;
};

TollSchema.statics.getTolls = async function () {
  const tolls = await this.find();
  return tolls;
};

TollSchema.statics.updateToll = async function (id, data, callback) {
  var toll = null;
  if (mongoose.isValidObjectId(id)) { toll = await this.findByIdAndUpdate(id, data); }
  return toll;
};

module.exports = mongoose.model('Toll', TollSchema);
