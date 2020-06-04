const db = require("../Models/users")



exports.signUpUser = async (req,res, next) => {
    User.insertOne( {  Email: 12312,Password:123123,
    FirstName:123123 },(err, result) => {
        if (err) {
            console.log('Unable insert user: ', err)
            throw err
        }
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
