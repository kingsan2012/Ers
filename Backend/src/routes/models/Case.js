const mongoose = require('mongoose');
const CaseSchema = new mongoose.Schema({
  createdAt: {type: Date, default: Date.now},
  estateAmount: Number,
  debts: Number,
  willFraction: Number,
  ignoreWillLimit: Boolean,
  heirs: Object,
  result: Object
});
module.exports = mongoose.model('Case', CaseSchema);
