const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  tokenId: {},
  userId: {},
  resetPassword: {}
});

const TokenModel = mongoose.model("Token", TokenSchema);

module.exports = TokenModel;
