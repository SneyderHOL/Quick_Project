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
  costs: {
    I: { type: Number, required: true, min: 0 },
    II: { type: Number, required: true, min: 0 },
    III: { type: Number, required: true, min: 0 },
    IV: { type: Number, default: 0, min: 0 },
    V: { type: Number, default: 0, min: 0 },
    VI: { type: Number, default: 0, min: 0 },
    VII: { type: Number, default: 0, min: 0 }
  },
  department: { type: String, default: '' },
  status: { type: Boolean, default: true },
  group: { type: Number, default: 1, min: 1, max: 3 }
}, { versionKey: false, timestamps: true });

/**
 * This function send a request to our db and create a new toll
 * @param {newToll} object The parameter is content of the request to the API, and
 * contain the new toll already validated it
 */
TollSchema.statics.createToll = async function (newToll) {
  // the object.keys is for test how long is the object
  if (Object.keys(newToll).length === 0) return null;

  try {
    return await this.create(newToll);
  } catch (err) {
    console.log('Schema not valid');
    return null;
  }
};

/**
 * This function send a request to our db and delete by id a toll
 * @param {id} string The parameter is the id of the toll
 */
TollSchema.statics.deleteToll = async function (id) {
  // will check the id of the value
  if (!isValid(id)) { return null; }
  return await this.findByIdAndDelete(id);
};

/**
 * This function is to find a toll by id
 * @param {id} string The parameter is the id of the toll
 */
TollSchema.statics.findTollById = async function (id) {
  let toll = null;
  if (mongoose.isValidObjectId(id)) { toll = await this.findById(id).exec(); }
  return toll;
};

/**
 * This function send a request to our db and bringing all tolls
 */
TollSchema.statics.getTolls = async function () {
  const tolls = await this.find();
  return tolls;
};

/**
 * This function is to update the toll and the characteristic
 * @param {id} string The id of the toll
 * @param {data} object The parameter contains the content of the new values of the tolls
 */
TollSchema.statics.updateToll = async function (id, data) {
  let toll = null;
  // console.log(Array.isArray(data))
  if (data === undefined || Object.getPrototypeOf(data) !== Object.prototype ||
      Object.keys(data).length === 0) {
    return null;
  }

  if (data._id || data.id) return null;

  const query = { update_at: new Date() };
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
    // console.log(query);
    toll = await this.findByIdAndUpdate(id, { $set: query }, { new: true });
  }
  return toll;
};

/**
 * This function send a request to our db and bringging the tolls that actually works
 * @param {status} bool Is a variable to bringging the validated tolls in colombia
 */
TollSchema.statics.findBySpecification = async function (status) {
  const tolls = await this.find({ status: status });
  return tolls;
};

module.exports = mongoose.model('Toll', TollSchema);
