const userModel = require("../Models/users");
// const dropbox = require('../dropbox/dropbox')
const index = require("../../index");
const fs = require('fs')
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

exports.updateUserInfo = async (req, res, next, url) => {
  console.log("NSAAAAAAAAAAMEEEEEEEEEEEEEEEe================",url);
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
exports.postUserAvatar = async (req, res, next) => {
  const file = req.body.file;
  console.log("-------------------------------file", file);
  const { id } = req.params;
  const user = await userModel.findOneAndUpdate(
    { _id: id },
    { avatar: file },
    { new: true }
  );
  if (!user) {
    return res.status(400).json({ msg: "Not found" });
  }
};

exports.postUnloadFile = async (req, res, next) => {
  console.log("NSAAAAAAAAAAMEEEEEEEEEEEEEEEe================");
  const file = req.files.file;
  const { id } = req.params;
  
  fs.mkdirSync(`./upload/user_${id}`,{recursive:true})
 
  const user = await userModel
    .findOneAndUpdate
    // { _id: id },
    // { $push: { files: file } },
    // { returnOriginal: false }
    ();
  if (!user) {
    return res.status(404).json({
      message: "Not found",
    });
  }
  file.mv(
    `/home/user/Desktop/backend/backend/upload/user_${id}/${file.name}`,
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
  
      // res.json({ fileName: file.name, filePath: `/files/${file.name}` });
    }
    
  );
  index.uploadStream1(file.name, id);
  
};

exports.getDownloadFile = async (req, res, next) => {
  // const {id} = req.params;
  // const fileInfo = await userModel.findOne({_id: id})
  // res.send(fileInfo.file)
  res.send("work");
  console.log("getDownloadFile");
};
