const isValid = require('mongoose').Types.ObjectId.isValid;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TollSchema = new Schema({
  name: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  operator: String,
  direction: { type: Number, default: 0, min: 0, max: 4 },
  costs: mongoose.SchemaTypes.Mixed,
  update_at: { type: Date, default: Date.now },
  department: { type: String, default: '' },
  status: { type: Boolean, default: true },
  group: { type: Number, default: 1, min: 1, max: 3 }
}, { versionKey: false });

TollSchema.statics.createToll = async function (toll) {
  // the object.keys is for test how long is the object
  if (Object.keys(toll).length === 0) return null;
  const tolls = await this.create(toll);
  return tolls;
};

TollSchema.statics.deleteToll = async function (id) {
  // will check the id of the value
  if (!isValid(id)) { return null; }
  return await this.findByIdAndDelete(id);
};

TollSchema.statics.findTollById = async function (id) {
  let toll = null;
  if (mongoose.isValidObjectId(id)) { toll = await this.findById(id).exec(); }
  return toll;
};

TollSchema.statics.getTolls = async function () {
  const tolls = await this.find();
  return tolls;
};

TollSchema.statics.updateToll = async function (id, data, callback) {
  let toll = null;
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
    toll = await this.findByIdAndUpdate(id, { $set: query }, { new: true });
  }
  return toll;
};

TollSchema.statics.findBySpecification = async function (status) {
  const tolls = await this.find({ status: status });
  return tolls;
};

module.exports = mongoose.model('Toll', TollSchema);
