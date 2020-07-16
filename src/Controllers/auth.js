const jwt = require("jsonwebtoken");
const userModel = require("../Models/users");
const authHelper = require("../helpers/authHelper");
const TokenModel = require("../Models/token");
const _ = require("lodash");
require("dotenv").config();
const DOMAIN = "sandboxc82b49ab804749708b8431385f806b59.mailgun.org";
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
    payload = jwt.verify(refreshToken, process.env.secret);
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
exports.resetPassword = async (req, res, next) => {
  const { email } = req.body;
  const { id } = req.params;
  const resetPasswordToken = authHelper.generateAccessToken(id);
  const isUserFind = await userModel.findOne({ email });
  if (!isUserFind) {
    res.status(400).json({ error: "Email is not found!" });
  } else {
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
    <a href="http://exceedbackend.herokuapp.com/createNewPassword/${resetPasswordToken}" > Click here password recovery </a> 
    `,
    };
    return isUserFind.updateOne(
      { resetLink: resetPasswordToken },
      (err, succes) => {
        if (err) {
          return res.status(400).json({ error: "Reset password link error." });
        }
        transporter.sendMail(mailOptions, (err, data) => {
          if (err) {
            return res.json({ error: err.message });
          }

          return res.json({
            message:
              "Email has been send, check your mail and kindly follow the instructions.",
            resetLink: isUserFind.resetLink,
          });
        });
      }
    );
  }
};
exports.createNewPassword = async (req, res, next) => {
  const { resetLink, newPassword } = req.body;
  if (resetLink) {
    jwt.verify(resetLink, process.env.secret, (err, decodedData) => {
      if (err) {
        return res
          .status(401)
          .json({ err: "Invalide token or it is expired." });
      }
      userModel.findOne({ resetLink }, (err, user) => {
        if (err || !user) {
          return res
            .status(400)
            .json({ err: "User wiht this token does not exist." });
        }
        const obj = {
          password: newPassword,
          resetLink: "",
        };
        user = _.extend(user, obj);
        user.save((err, user) => {
          if (err) {
            res.status(400).json({ err: "Reset password error!" });
          } else {
            res
              .status(200)
              .json({ message: "Your password has been changed." });
          }
        });
      });
    });
  } else {
    return res.status(401).json({ message: "Authecatione error!" });
  }
};
