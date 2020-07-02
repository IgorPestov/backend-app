const userModel = require("../Models/users");
const index = require("../../index");
const fs = require("fs");
const dropboxV2Api = require("dropbox-v2-api");

const dropbox = dropboxV2Api.authenticate({
  token: "oXHBknHRYiAAAAAAAAAAt7_tymRG67F5tIEuQdka-hwghFmIRXgygPRLjkbPnIw0",
});

exports.showUserInfo = async (req, res, next) => {
  const { id, avatar } = req.params;
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
        console.log(err);
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

exports.postUnloadFile = async (req, res, next) => {
  try {
    const file = req.files.file;
    const { id } = req.params;
    const { name, size, mimetype } = file;
    fs.mkdirSync(`./upload/user_${id}`, { recursive: true });

    const user = await userModel.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          files: {
            name,
            size,
            type: mimetype,
            filePath: `/user_${id}/${file.name}`
          },
        },
      }
    );
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
        res.json(user);
        console.log(user);
      }
    );
    index.uploadFile(file.name, id);
    console.log(user);
  } catch (err) {
    console.log(err);
  }
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
    },
    { returnOriginal: false }
  );
  if (avatar.url ? false : true) {
    console.log("work");
    dropbox(
      {
        resource: "deprecated/create_shared_link",
        parameters: {
          path: `/user_${id}/avatar/${avatar}`,
          short_url: false,
        },
      },

      async (err, result, response) => {
        if (result) {
          const url = result.url.slice(0, -4) + "raw=1";
          const path = result.path;

          const user = await userModel.findOneAndUpdate(
            { _id: id },
            { avatar: { url, path } },
            { new: true }
          );
          if (!user) {
            return res.status(400).json({ msg: "Not found" });
          }
        }
      }
    );
  }
  res.send(user);
};
