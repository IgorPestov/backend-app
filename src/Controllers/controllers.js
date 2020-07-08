const userModel = require("../Models/users");
const fs = require("fs");
const dropboxV2Api = require("dropbox-v2-api");
const dropbox = dropboxV2Api.authenticate({
  token: "oXHBknHRYiAAAAAAAAACmX2D2YYsTPbcfzUleCtho5xNj9Qwr38iChQCT6M8M6ng",
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

  console.log(filesInfo);
  if (!filesInfo) {
    return res.status(404).json({
      message: "Not found",
    });
  }
  res.send(filesInfo.files);
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
    `/home/user/Desktop/backend/backend/upload/avatar_${id}/${file.name}`,
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
        `/home/user/Desktop/backend/backend/upload/avatar_${id}/${file.name}`
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
          const url = result.url.slice(0, -4) + "raw=1";
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

exports.postUnloadFile = async (req, res, next) => {
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
          mimetype,
          filePath: `/user_${id}/${file.name}`,
        },
      },
    },
    { returnOriginal: false }
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
    }
  );
  await dropbox(
    {
      resource: "files/upload",
      parameters: { path: `/user_${id}/${file.name}` },
      mode: "add",
      autorename: true,
      mute: false,
      strict_conflict: false,
      symlink_info: true,
      readStream: fs.createReadStream(
        `/home/user/Desktop/backend/backend/upload/user_${id}/${file.name}`
      ),
    },
    (err, result, response) => {
      fs.rmdirSync(`./upload/user_${id}`, { recursive: true });
      dropbox(
        {
          resource: "deprecated/create_shared_link",
          parameters: {
            path: `/user_${id}/${file.name}`,
            short_url: false,
          },
        },
        async (err, result, response) => {
          const url = result.url.slice(0, -1) + "1";
          const urlImg = result.url.slice(0, -4) + "raw=1";
          const user = await userModel.findOneAndUpdate(
            { "files.name": name },
            { $set: { "files.$.url": url, "files.$.urlImg": urlImg } },
            { returnOriginal: false }
          );
          res.send(user);
        }
      );
    }
  );
};

exports.deleteFile = async (req, res, next) => {
  const { id } = req.params;
  const { path, idFile } = req.body;

  await dropbox(
    {
      resource: "files/delete",
      parameters: {
        path: `${path}`,
      },
    },
    async (err, result, response) => {
      const user = await userModel.findByIdAndUpdate(
        { _id: id },
        { $pull: { files: { _id: idFile } } },
        { returnOriginal: false }
      );
      res.send(user);
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
