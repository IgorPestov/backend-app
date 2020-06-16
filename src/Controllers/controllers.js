const userModel = require("../Models/users");
const jwt = require("jsonwebtoken");

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
    res.status(user);
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
  console.log(isUserFind);
  const { _id } = isUserFind;
  const token = jwt.sign(
    {
      email,
      _id
    },
    process.env.jwt,
    { expiresIn: 60 * 60 }
  );
  res.status(200).json({
    token: `Bearer ${token}`,
  });
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
