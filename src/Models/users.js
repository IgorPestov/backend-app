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
  files:
    [{  
        name: String,
        size: String,
        type: {type : String},
        filePath: String,
        url: String
    }]
});

const userModel = mongoose.model("User", userShema);

module.exports = userModel;
