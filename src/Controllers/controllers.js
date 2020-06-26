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
exports.postUserAvatar = async (req, res, next) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No avatar uploaded" });
  }
  const file = req.files.file;
  console.log(req)
  const { id } = req.params;
  const user = await userModel.findOneAndUpdate({ _id: id }, { avatar: req.body.url });
  if (!user) {
    return res.status(400).json({ msg: "Not found" });
  }
  file.mv(`/home/user/Desktop/backend/backend/public/files/${file.name}`),
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.json({ fileName: file.name, filePath: `/home/user/Desktop/backend/backend/public/files/${file.name}` });
    };
};

exports.postUnloadFile = async (req, res, next) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  const file = req.files.file;
  const { id } = req.params;
  const user = await userModel.findOneAndUpdate(
    { _id: id },
    { $push: { files: file } },
    { returnOriginal: false }
  );
  if (!user) {
    return res.status(404).json({
      message: "Not found",
    });
  }
  file.mv(
    `/home/user/Desktop/backend/backend/public/files/${file.name}`,
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      res.json({ fileName: file.name, filePath: `/files/${file.name}` });
    }
  );
};

exports.getDownloadFile = async (req, res, next) => {
  // const {id} = req.params;
  // const fileInfo = await userModel.findOne({_id: id})
  // res.send(fileInfo.file)
  res.send("work");
  console.log("getDownloadFile");
};
