const jwt = require("jsonwebtoken");
const randtoken = require("rand-token");
const { tokens, secret } = require("../config/configToken").jwt;
const TokenModel = require("../Models/token");

const generateAccessToken = (userId) => {
  const payload = {
    userId,
    type: tokens.access.type,
  };
  const options = { expiresIn: tokens.access.expiresIn };
  return jwt.sign(payload, secret, options);
};
const generateRefreshToken = () => {
  const payload = {
    id: randtoken.uid(256),
    type: tokens.refresh.type
  };
  const options = { expiresIn: tokens.refresh.expiresIn};
  return {
    id: payload.id,
    token: jwt.sign(payload, secret, options)
  }
};
const replaceDbRefreshToken = (tokenId, userId) =>
  TokenModel.findOneAndRemove({ userId })
    .exec()
    .then(() => TokenModel.create({ tokenId, userId }));

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  replaceDbRefreshToken,
};
