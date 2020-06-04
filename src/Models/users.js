const mongoose = require("mongoose")

const userShema = new mongoose.Schema ({
    email: String
    ,
    password: String
    ,
    firstName: String

})

const userModel = mongoose.model("User",userShema)

module.exports = userModel