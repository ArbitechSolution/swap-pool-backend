const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PoolSchema = new Schema({
  id: {
    type: String,
  },
  address: {
    type: String,
  },
  reserve0: {
    type: Number,
  },
  reserve1: {
    type: Number,
  },
  token1: {
    type: String,
  },
  token2: {
    type: String,
  },
});

const PoolModal = mongoose.model("Pool", PoolSchema);
module.exports = PoolModal;
