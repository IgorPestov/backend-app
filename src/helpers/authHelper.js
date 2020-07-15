const jwt = require("jsonwebtoken");
const randtoken = require("rand-token");
const { tokens } = require("../config/configToken").jwt;
const TokenModel = require("../Models/token");
require("dotenv").config();

const generateAccessToken = (userId) => {
  const payload = {
    userId,
    type: tokens.access.type,
  };
  const options = { expiresIn: tokens.access.expiresIn };
  return jwt.sign(payload, process.env.secret, options);
};
const generateRefreshToken = () => {
  const payload = {
    id: randtoken.uid(256),
    type: tokens.refresh.type,
  };
  const options = { expiresIn: tokens.refresh.expiresIn };
  return {
    id: payload.id,
    token: jwt.sign(payload, process.env.secret, options),
  };
};
const generateResetPassword = () => {
  const payload = {
    userId,
    type: tokens.resetPassword.type,
  };
  const options = { expiresIn: tokens.resetPassword.expiresIn };
  return jwt.sign(payload, process.env.secretReset, options);
};
const replaceDbRefreshToken = (tokenId, userId) =>
  TokenModel.findOneAndRemove({ userId })
    .exec()
    .then(() => TokenModel.create({ tokenId, userId }));

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  replaceDbRefreshToken,
  generateResetPassword,
};
