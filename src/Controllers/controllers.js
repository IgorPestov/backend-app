const userModel = require("../Models/users");

exports.signUpUser = async (req, res, next) => {
  const { email, password, firstName } = req.body;
  const user = new userModel({
    email,
    password,
    firstName,
  });

  const check = email.trim() && password.trim() && firstName.trim();
  if (!check) {
    return res.status(400).json({
      message: "repeat entry",
    });
  }

  const isUserExist = await userModel.findOne({ email });
  if (isUserExist) {
    return res.status(400).json({
      message: "E-mail busy",
    });
  }
  user.save((err, user) => {
    if (err) {
      console.log("err", err);
    }
    res.send(user);
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
  res.end(isUserFind);
};

exports.showUserInfo = async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findOne({ _id: id });
  if (user) {
    res.send(user);
  } else {
    return res.status(404).json({
      message: "User not find",
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
  if (!firstName.trim()) {
    return res.status(400).json({
      message: "First name cannot be empty",
    });
  }
  res.send(user);
  console.log("updateUserInfo");
};

exports.showFiles = async (req, res, next) => {
  const { id } = req.params;
  const filesInfo = await userModel.findOne({ _id: id });
  res.send(fileInfo.files);
  if (filesInfo) {
    return res.status(404).json({
      message: "Not find",
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
      message: "Not find",
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
