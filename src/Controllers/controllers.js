const userModel = require("../Models/users")



exports.signUpUser = async (req,res, next) => {
    const user = new userModel({Email:req.body.Email,Password:req.body.Password ,FirstName:req.body.FirstName })
    const check = req.body.Email.trim() && req.body.Password.trim() && req.body.FirstName.trim()
    if(!check) {
       return  next({status: 400, massage: "Empty fields"})

    }
    user.save((err, user) => {
        if (err) {
            console.log('err', err)
        }
        console.log('saved user', user)
    })
    console.log('singUpUser')
}

exports.signInUser = async (req,res, next) => {
    console.log('signInUser')
}

exports.showUserInfo = async (req,res, next) => {

    console.log('showUserInfo')
}

exports.updateUserInfo = async (req,res, next) => {
    console.log('updateUserInfo')
}

exports.showFile = async (req,res, next) => {
    console.log('showFile')
}

exports.putDownloadFile = async (req,res, next) => {
    console.log('putDownloadFile')
}

exports.getUnloadFile = async (req,res, next) => {
    console.log('getUnloadFile')
}
