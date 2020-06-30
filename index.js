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
const controllers = require('./src/Controllers/controllers')
const dropbox = dropboxV2Api.authenticate({
  token: "oXHBknHRYiAAAAAAAAAARuNFVS7_uMPA7BMImzSj95RDFVTbzkM2ApmZP_Ce2aju",
});
console.log("----------------------------------");

// dropbox({
//     resource: 'files/download',
//     parameters: {
//         path: '/user_5efb2be7bb9a2111adde0e05/node-v14.2.0-linux-x64.tar.xz'
//     }
// }, (err, result, response) => {
//     //download completed
// })
// .pipe(fs.createWriteStream('/home/user/Downloads/node-v14.2.0-linux-x64.tar.xz'));
// // use session ref to call API, i.e.:

exports.uploadStream1 = (name, id) => {
  const uploadStream = dropbox(
    {
      resource: "files/upload",
      parameters: { path: `/user_${id}/${name}`},
      'mode': 'add',
      'autorename': true,
      'mute': false,
      'strict_conflict': false,
      symlink_info:true
    },
    (err, result, response) => {
    //   console.log("======================", result);

      fs.rmdirSync(`./upload/user_${id}`, { recursive: true });
    }
  );
  fs.createReadStream(
    `/home/user/Desktop/backend/backend/upload/user_${id}/${name}`
  ).pipe(uploadStream);
};
dropbox({
    resource: 'deprecated/create_shared_link',
    parameters: {
        'path': '/user_5ef5e1de21d237698be58c24/t45p9fh0x-u01021k8q9g-cddc98106831-512 (1).png',
        'short_url': false
    }
}, (err, result, response) => {
    console.log(result.url)
});

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
