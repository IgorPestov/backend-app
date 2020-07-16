const userModel = require("../Models/users");
const fs = require("fs");
const dropboxV2Api = require("dropbox-v2-api");
require("dotenv").config();

const dropbox = dropboxV2Api.authenticate({
  token: process.env.TOKEN_DROPBOX,
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

exports.postUserAvatar = async (req, res, next) => {
  const file = req.files.file;
  const { id } = req.params;
  const user = await userModel.findOne({ _id: id });
  if (user.avatar ? user.avatar.path : false) {
    await dropbox(
      {
        resource: "files/delete",
        parameters: {
          path: `${user.avatar.path}`,
        },
      },
      (err, result, response) => {}
    );
  }
  fs.mkdirSync(`./upload/avatar_${id}`, { recursive: true });
  file.mv(
    `./upload/avatar_${id}/${file.name}`,
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    }
  );
  await dropbox(
    {
      resource: "files/upload",
      parameters: { path: `/user_${id}/avatar/${file.name}` },
      mode: "add",
      autorename: true,
      mute: false,
      strict_conflict: false,
      symlink_info: true,
      readStream: fs.createReadStream(
        `./upload/avatar_${id}/${file.name}`
      ),
    },
    (err, result, response) => {
      fs.rmdirSync(`./upload/avatar_${id}`, { recursive: true });
      dropbox(
        {
          resource: "deprecated/create_shared_link",
          parameters: {
            path: `/user_${id}/avatar/${file.name}`,
            short_url: false,
          },
        },

        async (err, result, response) => {
          const url = result.url.slice(0) + "raw=1";
          const path = result.path;

          const user = await userModel.findOneAndUpdate(
            { _id: id },
            { avatar: { url, path } },
            { new: true }
          );
          res.status(200).json(user.avatar);
        }
      );
    }
  );
};

exports.updateUserInfo = async (req, res, next) => {
  const {
    firstName,
    lastName,
    age,
    gender,
    aboutYourself,
    files,
    avatar,
  } = req.body;
  const { id } = req.params;
  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      firstName,
      lastName,
      age,
      gender,
      aboutYourself,
      files,
      avatar,
    },
    { returnOriginal: false }
  );
  res.send(user);
};
