const userModel = require("../Models/users");
const jwt = require("jsonwebtoken");
const randtoken = require('rand-token')
const authHelper = require('../helpers/authHelper')
const TokenModel =require('../Models/token')
const updateTokens = (_id) => {
  const accessToken = authHelper.generateAccessToken(_id)
  const refreshToken = authHelper.gereateRefreshToken(_id)

  return authHelper.replaceDbRefreshToken(refreshToken.id, _id)
  .then(() => ({
    accessToken,
    refreshToken: refreshToken.token,
  }))
}
exports.refreshTokens = ( req, res, next) => { 
  const { refreshToken } = req.body;
  let payload;
  try { 
    payload = jwt.verify(refreshToken, process.env.jwt);
    if( payload.type !== 'refresh') {
      res.status(400).json({message: 'Invalid token!'});
      return;
    }
  }catch (e) {
    if(e instanceof jwt.TokenExpiredError) {
      res.status(400).json({message: 'Token expired!'});
      return;
    } else if (e instanceof jwt.JsonWebTokenError) {
       res.status(400).json({message: 'Invalid token!'});
      return;
    }
    
  }
  TokenModel.findOne({tokenId: payload.id})
  .exec()
  .then((token)=>{ 
    if (token === null ) {
      throw new Error('Invalide token!');
    }
    return updateTokens(token._id);

  })
  .then(tokens => res.json(tokens))
  .catch(err => res.status(400).json({message: err.message}))
}

exports.signUpUser = async (req, res, next) => {
  console.log("singUpUser");
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
    updateTokens(_id).then(tokens => res.json(tokens))
  });
  console.log("singUpUser");
};
 
exports.signInUser = async (req, res, next) => {
  const { email, password } = req.body;
  const isUserFind = await userModel.findOne({ email, password });
  if (!isUserFind) {
    return res.status(400).json({
      message: "Invalid e-mail or password",
    });
  }
  console.log(isUserFind._id)
  updateTokens(isUserFind._id).then(tokens => res.json(tokens))
};

exports.showUserInfo = async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findOne({ _id: id });
  if (user) {
    res.send(user);
  } else {
    return res.status(404).json({
      message: "User not found",
    });
  }
  console.log("showUserInfo");
}; 

exports.getAll = (req, res) => {
  userModel.find()
  .exec()
  .then(userModels=>res.json(userModels))
  .catch(err => res.status(500).json(err))
}

exports.updateUserInfo = async (req, res, next) => {
  const { firstName, lastName, age, gender, aboutYourself, avatar } = req.body;
  const { id } = req.params;
  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      firstName,
      lastName,
      age,
      gender,
      aboutYourself,
      avatar,
    },
    { returnOriginal: false }
  );
  res.send(user);
  console.log("updateUserInfo");
};

exports.showFiles = async (req, res, next) => {
  const { id } = req.params;
  const filesInfo = await userModel.findOne({ _id: id });
  res.send(fileInfo.files);
  if (filesInfo) {
    return res.status(404).json({
      message: "Not found",
    });
  }
  console.log("showFiles");
};

exports.putUnloadFile = async (req, res, next) => {
  const { files } = req.body;
  const { id } = req.params;
  const user = await userModel.findOneAndUpdate(
    { _id: id },
    { $push: { files } },
    { returnOriginal: false }
  );
  if (!user) {
    return res.status(404).json({
      message: "Not found",
    });
  }
  res.send(user);
  console.log("putUnloadFile");
};

exports.getDownloadFile = async (req, res, next) => {
  // const {id} = req.params;
  // const fileInfo = await userModel.findOne({_id: id})
  // res.send(fileInfo.file)
  res.send("work");
  console.log("getDownloadFile");
};
