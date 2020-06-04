const userModel = require("../Models/users")


exports.signUpUser = async (req, res, next) => {

    try {
        const {email, password, firstName} = req.body
        const isUserExist = await userModel.findOne({email});
        if (isUserExist) {
            return false
        }
        const user = new userModel({
            email,
            password,
            firstName
        })
        const check = email.trim() && password.trim() && firstName.trim()
        if (!check) {
            return false
        }

        user.save((err, user) => {
            if (err) {
                console.log('err', err)
            }
            console.log('saved user', user)
        })
        console.log('singUpUser')

    } catch (err) {
        next(err)
    }

}

exports.signInUser = async (req, res, next) => {
    console.log('signInUser')
}

exports.showUserInfo = async (req, res, next) => {

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
