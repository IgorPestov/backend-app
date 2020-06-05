const userModel = require("../Models/users")
const ObjectID = require("mongodb").ObjectId


exports.signUpUser = async (req, res, next) => {
    const {email, password, firstName} = req.body;
    const user = new userModel({
        email,
        password,
        firstName
    })
    const check = email.trim() && password.trim() && firstName.trim();
    if (!check) {
        return false
    }
    const isUserExist = await userModel.findOne({email})
    if (isUserExist) {
        res.end("Email zanyat")
    }
    user.save((err, user) => {
        if (err) {
            console.log("err", err)
        }
    })
    console.log('singUpUser')
}

exports.signInUser = async (req, res, next) => {
    const {email, password} = req.body;
    const isUserFind = await userModel.findOne({email, password})
    if (!isUserFind) {
       res.end('erro')
    }
    res.end(`hello, ${isUserFind.firstName}???`)
}

exports.showUserInfo = async (req, res, next) => {
    const {id} = req.params
     const user = await userModel.find({_id:id})
    if(user) {
        res.send(user)
    } else {
        res.send("User not find")
    }

    console.log(details)
    console.log('showUserInfo')
}

exports.updateUserInfo = async (req, res, next) => {
    console.log('updateUserInfo')
}

exports.showFile = async (req, res, next) => {
    console.log('showFile')
}

exports.putDownloadFile = async (req, res, next) => {
    console.log('putDownloadFile')
}

exports.getUnloadFile = async (req, res, next) => {
    console.log('getUnloadFile')
}
