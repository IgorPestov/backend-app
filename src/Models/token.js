const mongoose = require("mongoose")

const TokenSchema = new mongoose.Schema({
    tokenId:String,
    _id:String,

})

const TokenModel = mongoose.model('Token', TokenSchema)

module.exports = TokenModel;