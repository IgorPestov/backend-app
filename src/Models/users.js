const mongoose = require("mongoose")

const userShema = new mongoose.Schema ({
    Email: {
    },
    Password: {
    },
    FirstName: {
    }
})

const userModel = mongoose.model("User",userShema)

module.exports = userModel