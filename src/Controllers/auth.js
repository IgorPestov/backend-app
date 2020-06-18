const jwt = require("jsonwebtoken");
const userModel = require("../Models/users");
const authHelper = require("../helpers/authHelper");
const TokenModel = require("../Models/token");
const { secret } = require("../config/configToken").jwt;

const updateTokens = (userId) => {
  const accessToken = authHelper.generateAccessToken(userId);
  const refreshToken = authHelper.generateRefreshToken();
  return authHelper.replaceDbRefreshToken(refreshToken.id, userId).then(() => ({
    accessToken,
    refreshToken: refreshToken.token,
  }));
};
exports.refreshTokens = (req, res) => {
  const { refreshToken } = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, secret);
    if (payload.type !== "refresh") {
      res.status(400).json({ message: "Invalid token! 1" });
      return;
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: "Token expired!" });
      return;
    } else if (e instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: "Invalid token! 2" });
      return;
    }
  }
  TokenModel.findOne({ tokenId: payload.id })
    .exec()
    .then((token) => {
      if (token === null) {
        throw new Error("Invalide token!");
      }
      return updateTokens(token.userId);
    })
    .then((tokens) => res.json(tokens))
    .catch((err) => res.status(400).json({ message: err.message }));
};

exports.signUpUser = async (req, res, next) => {
  const { email, password, firstName } = req.body;
  const user = new userModel({
    email,
    password,
    firstName,
  });

  const isUserExist = await userModel.findOne({ email });
  if (isUserExist) {
    return res.status(400).json({
      message: "E-mail already exist",
    });
  }
  user.save((err, user) => {
    if (err) {
      console.log("err", err);
    }

    updateTokens(isUserFind._id).then((token) => res.json(token));
  });
};

exports.signInUser = async (req, res, next) => {
  const { email, password } = req.body;
  const isUserFind = await userModel.findOne({ email, password });
  if (!isUserFind) {
    return res.status(400).json({
      message: "Invalid e-mail or password",
    });
  }
  console.log(isUserFind._id);
  updateTokens(isUserFind._id).then((token) => res.json(token));
};
