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
  token: "oXHBknHRYiAAAAAAAAAAt7_tymRG67F5tIEuQdka-hwghFmIRXgygPRLjkbPnIw0",
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
