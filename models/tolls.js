const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TollSchema = new Schema({
  name: String,
  coordenates: { lat: Number, lng: Number },
  operator: String,
  direction: { type: Number, default: 0 },
  toll_cost: mongoose.SchemaTypes.Mixed,
  date_modification: { type: Date, default: Date.now },
  department: { type: String, default: '' },
  id: Number
});

TollSchema.statics.createToll = function (toll) {
  this.create(toll, (error) => { console.log(error); });
};

TollSchema.statics.deleteToll = async function (id) {
  await this.findByIdAndDelete(id);
};

TollSchema.statics.findTollById = async function (id, callback) {
    var toll = null;
    if (mongoose.isValidObjectId(id)) { toll = await this.findById(id).exec();}
    return toll
};

TollSchema.statics.getTolls = async function () {
  const tolls = await this.find();
  return tolls;
};

TollSchema.statics.updateToll = async function (id, data, callback) {
  var toll = null
  if (mongoose.isValidObjectId(id)) { toll = await this.findByIdAndUpdate(id, data);}
  return toll;
};

module.exports = mongoose.model('Toll', TollSchema);
