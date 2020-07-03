const userModel = require("../Models/users");
const index = require("../../index");
const fs = require("fs");
const dropboxV2Api = require("dropbox-v2-api");

const dropbox = dropboxV2Api.authenticate({
  token: "oXHBknHRYiAAAAAAAAAA8GjfN9XxsawVS40zg77LN5MbpqFzapmU_20q5D1q0Ojv",
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
  // dropbox(
  //   {
  //     resource: "deprecated/create_shared_link",
  //     parameters: {
  //       path: `/user_${id}/avatar/${avatar}`,
  //       short_url: false,
  //     },
  //   },
  //   (err, result, response) => {}
  // );
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
  index.uploadFile(file.name, id);
  res.send(user);
};

exports.getDownloadFile = async (req, res, next) => {
  const {id} = req.params
  const {filePath} = req.body
  dropbox(
    {
      resource: "deprecated/create_shared_link",
      parameters: {
        path: `${filePath}`,
        short_url: false,
      },
    },
    async (err, result, response) => {
     console.log("=====================",result)
      const userFile = await userModel.findOneAndUpdate(
        { _id: id },
       
      );
      console.log('UUUUUUUUUUUUSEEEEEEEEER',userFile)
      // res.send(user)
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
    avatar,
    files,
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
    },
    { returnOriginal: false }
  );
  if (avatar.url ? false : true) {
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
          // if (!user) {
          //   return res.status(400).json({ msg: "Not found" });
          // }
          res.send(user);
        }
      }
    );
  }
  res.send(user);
};
