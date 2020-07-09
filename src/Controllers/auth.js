const jwt = require("jsonwebtoken");
const userModel = require("../Models/users");
const authHelper = require("../helpers/authHelper");
const TokenModel = require("../Models/token");
require("dotenv").config();
const { secret } = require("../config/configToken").jwt;
// const mailgun = require("mailgun-js");
const DOMAIN = "sandboxc82b49ab804749708b8431385f806b59.mailgun.org";
// const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });
const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");

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
      res.status(400).json({ message: "Invalid token!" });
      return;
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: "Token expired!" });
      return;
    } else if (e instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: "Invalid token!" });
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

    updateTokens(user._id).then((token) => res.json(token));
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
  updateTokens(isUserFind._id).then((token) => res.json(token));
};
exports.forgotPassword = async (req, res, next) => {
  console.log("here");
  const { email } = req.body;
  const { id } = req.params;
  const resetPasswordToken = authHelper.generateAccessToken(id);
  const isUserFind = await userModel.findOne({ email });

  const auth = {
    auth: {
      api_key: process.env.MAILGUN_APIKEY,
      domain: DOMAIN,
    },
  };

  let transporter = nodemailer.createTransport(mailGun(auth));

  let mailOptions = {
    from: "team-team@mail.com",
    to: email,
    subject: "Recovery account",
    html: `
    <h1>Please click on given link to reset your password</h1>
    <a href="http://localhost:3001/user/signIn" >CLICK HERE</a> 
    `,
  };
  return user.updateOne({})
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return console.log("Error occurs");
    }
    return console.log("Email sent!!!");
  });
};
exports.createNewPassword = async (req,res,next) => {

}