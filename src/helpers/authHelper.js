const jwt = require("jsonwebtoken");
const randtoken = require("rand-token");
const { tokens, secret } = require("../config/configToken").jwt;
const TokenModel = require("../Models/token");
const generateAccessToken = (_id) => {
  const payload = {
    _id,
    type: tokens.access.type,
  };
  const options = { expiresIn: tokens.access.expiresIn };
  return jwt.sign(payload, secret, options);
};
const gereateRefreshToken = () => {
  const payload = {
    id: randtoken.uid(256),
    token: jwt.sign(payload, secret, options),
  };
};
const replaceDbRefreshToken = (tokenId, _id) =>
  TokenModel.findByIdAndRemove({ _id })
    .exec()
    .then(() => TokenModel.create({ tokenId, _id }));

module.exports = {
  generateAccessToken,
  gereateRefreshToken,
  replaceDbRefreshToken,
};
