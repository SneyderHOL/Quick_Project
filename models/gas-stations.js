// const isValid = require('mongoose').Types.ObjectId.isValid;
// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;
// const TollSchema = new Schema({
//   id: Number,
//   distance: { type: Number, required: true },
//   duration: { type: Number, required: true },
//   start_location: {
//     lat: { type: Number, required: true },
//     lng: { type: Number, required: true }
//   },
//   end_location: {
//     lat: { type: Number, required: true },
//     lng: { type: Number, required: true }
//   },
//   hash: { type: String, default: '' }
// }, { versionKey: false });

// TollSchema.statics.createToll = async function (toll) {
//   // the object.keys is for test how long is the object
//   if (Object.keys(toll).length === 0) return null;
//   try {
//     return await this.create(toll);
//   } catch (err) {
//     // console.error(err)
//     // catch invalid input and return null
//     console.log('Schema not valid')
//     return null;
//   }
// };

// TollSchema.statics.deleteToll = async function (id) {
//   // will check the id of the value
//   if (!isValid(id)) { return null; }
//   return await this.findByIdAndDelete(id);
// };

// TollSchema.statics.findTollById = async function (id) {
//   var toll = null;
//   if (mongoose.isValidObjectId(id)) { toll = await this.findById(id).exec(); }
//   return toll;
// };

// TollSchema.statics.getTolls = async function () {
//   const tolls = await this.find();
//   return tolls;
// };

// TollSchema.statics.updateToll = async function (id, data, callback) {
//   var toll = null;
//   if (typeof (data) !== typeof ({})) return null;
//   if (Object.keys(data).length === 0) return null;
//   if (mongoose.isValidObjectId(id)) { toll = await this.findByIdAndUpdate(id, data, { new: true }); }
//   return toll;
// };

// TollSchema.statics.findBySpecification = async function (status) {
//   const tolls = await this.find({ status: status });
//   return tolls;
// };

// module.exports = mongoose.model('Toll', TollSchema);
