const mongoose = require("mongoose");

const userShema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  age: String,
  gender: String,
  avatar: Object,
  aboutYourself: String,
  files: [
    {
      name: String,
      size: String,
      mimetype: String,
      filePath: String,
      url: String,
      urlImg: String,
    },
  ],
  resetLink: Object,
});

const userModel = mongoose.model("User", userShema);

module.exports = userModel;
