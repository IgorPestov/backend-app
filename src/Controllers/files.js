const fs = require("fs");
const userModel = require("../Models/users");
const dropboxV2Api = require("dropbox-v2-api");
require("dotenv").config();

const dropbox = dropboxV2Api.authenticate({
  token: process.env.TOKEN_DROPBOX,
});
exports.showFiles = async (req, res, next) => {
  const { id } = req.params;
  const filesInfo = await userModel.findOne({ _id: id });

  if (!filesInfo) {
    return res.status(404).json({
      message: "Not found",
    });
  }
  res.send(filesInfo.files);
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
    `./upload/user_${id}/${file.name}`,
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
        `./upload/user_${id}/${file.name}`
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
          const updateUser = await userModel.findOneAndUpdate(
            { _id: id, "files.name": name },
            { $set: { "files.$.url": url, "files.$.urlImg": urlImg } },
            { returnOriginal: false }
          );

          res.send(updateUser);
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
