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
    avatar: Object,
    aboutYourself: {

    },
    files: Array
})

const userModel = mongoose.model("User",userShema)

module.exports = userModel;