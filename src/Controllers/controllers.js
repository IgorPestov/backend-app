const userModel = require("../Models/users");

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
