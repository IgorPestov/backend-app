const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const router = require("./src/Routes/routes");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const dropboxV2Api = require("dropbox-v2-api");
const userModel = require("./src/Models/users");
const dropbox = dropboxV2Api.authenticate({
  token: "oXHBknHRYiAAAAAAAAAAS3ZTmPNTIvoYZxNUk7tQNWOTEvo5KmNHzuGimKzUViLP",
});
console.log("----------------------------------");

exports.uploadAvatar = (name, id) => {
  const uploadStream = dropbox(
    {
      resource: "files/upload",
      parameters: { path: `/user_${id}/avatar/${name}` },
      mode: "add",
      autorename: true,
      mute: false,
      strict_conflict: false,
      symlink_info: true,
    },
    (err, result, response) => {
      fs.rmdirSync(`./upload/avatar_${id}`, { recursive: true });
    }
  );
  fs.createReadStream(
    `/home/user/Desktop/backend/backend/upload/avatar_${id}/${name}`
  ).pipe(uploadStream);
};
exports.saveAvatar = (name, id) => {
  dropbox(
    {
      resource: "deprecated/create_shared_link",
      parameters: {
        path: `/user_${id}/avatar/${name}`,
        short_url: false,
      },
    },
    (err, result, response) => {
      const url = result.url.slice(0, -4) + "raw=1";
      const path = result.path;

      const userAvatar = async () => {
        const user = await userModel.findOneAndUpdate(
          { _id: id },
          { avatar: { url, path } },
          { new: true }
        );
        console.log("AVATAR", user.avatar)
        if (!user) {
          return res.status(400).json({ msg: "Not found" });
        }
      };
      userAvatar();
    }
  );
};
exports.uploadFile = (name, id) => {
  const uploadStream = dropbox(
    {
      resource: "files/upload",
      parameters: { path: `/user_${id}/${name}` },
      mode: "add",
      autorename: true,
      mute: false,
      strict_conflict: false,
      symlink_info: true,
    },
    (err, result, response) => {
      fs.rmdirSync(`./upload/user_${id}`, { recursive: true });
    }
  );
  fs.createReadStream(
    `/home/user/Desktop/backend/backend/upload/user_${id}/${name}`
  ).pipe(uploadStream);
};

// downloadStream.pipe(uploadStream);

app.use(cors());
app.use(fileUpload());
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database is connected successfully");
  })
  .catch((err) => {
    console.log("Error with connecting to database");
  });
app.use(bodyParser.json());
app.use("/user", router);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
