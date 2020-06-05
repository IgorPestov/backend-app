const mongoose = require("mongoose")

const userShema = new mongoose.Schema ({
    email: {

    },
    password: {

    },
    firstName: {

    }

})

const userModel = mongoose.model("User",userShema)

module.exports = userModel;