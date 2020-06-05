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

    }
})

const userModel = mongoose.model("User",userShema)

module.exports = userModel;