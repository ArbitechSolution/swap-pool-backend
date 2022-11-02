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
    type: String,
  },
  reserve1: {
    type: String,
  },
  token1: {
    type: String,
  },
  token2: {
    type: String,
  },
  symbol1: {
    type: String,
  },
  symbol2: {
    type: String,
  },
});

const PoolModal = mongoose.model("PoolPairs", PoolSchema);
module.exports = PoolModal;
