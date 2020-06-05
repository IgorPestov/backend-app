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

    },
    aboutYourself: {

    },
    file: Array
})

const userModel = mongoose.model("User",userShema)

module.exports = userModel;