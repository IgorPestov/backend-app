const mongoose = require("mongoose")

const userShema = new mongoose.Schema ({
    email: {

    },
    password: {

    },
    firstName: {

    },

    lastName: {

    },
    age: {

    },
    gender: {

    },
    avatar: {
        type: String
    },
    aboutYourself: {

    },
    files: Array
})

const userModel = mongoose.model("User",userShema)

module.exports = userModel;