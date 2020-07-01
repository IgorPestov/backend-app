const userModel = require("../Models/users");
const index = require("../../index");
const fs = require("fs");
const dropboxV2Api = require("dropbox-v2-api");

const dropbox = dropboxV2Api.authenticate({
  token: "oXHBknHRYiAAAAAAAAAAS3ZTmPNTIvoYZxNUk7tQNWOTEvo5KmNHzuGimKzUViLP",
});

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
};
exports.postUserAvatar = async (req, res, next) => {
  const file = req.files.file;
  const { id } = req.params;

  fs.mkdirSync(`./upload/avatar_${id}`, { recursive: true });
  file.mv(
    `/home/user/Desktop/backend/backend/upload/avatar_${id}/${file.name}`,
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
    }
  );
  index.uploadAvatar(file.name, id);

  const user = await userModel.findOne({ _id: id });
  if (user.avatar ? user.avatar.path : false) {
    dropbox(
      {
        resource: "files/delete",
        parameters: {
          path: `${user.avatar.path}`,
        },
      },
      (err, result, response) => {}
    );
  }
};
exports.loadAvatar = async (req, res, next) => {
  
  const {id} = req.params
  const name = req.body.payload
  console.log(name)
  index.saveAvatar(name, id)
}
exports.postUnloadFile = async (req, res, next) => {
  const file = req.files.file;
  const { id } = req.params;

  fs.mkdirSync(`./upload/user_${id}`, { recursive: true });

  const user = await userModel.findOneAndUpdate();
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
  index.uploadFile(file.name, id);
};

exports.getDownloadFile = async (req, res, next) => {
  // const {id} = req.params;
  // const fileInfo = await userModel.findOne({_id: id})
  // res.send(fileInfo.file)
  res.send("work");
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
};
