const express = require("express");
const router = express.Router();
const controllers = require("../Controllers/controllers");
const auth = require('../Controllers/auth')


//localhost:3000/user/showUserInfo/1
router.get("/showUserInfo/:id",  controllers.showUserInfo)
//localhost:3000/updateUserInfo/1
router.put("/updateUserInfo/:id", controllers.updateUserInfo)
//localhost:3000/showFile/1
router.get("/showFiles/:id", controllers.showFiles)
//localhost:3000/uploadFile/1
router.post("/uploadFile/:id", controllers.postUnloadFile)
//localhost:3000/downloadFile/1
router.post("/deleteFile/:id", controllers.deleteFile)
//localhost:3000/updateUserInfo/1
router.post("/postUserAvatar/:id", controllers.postUserAvatar)
//localhost:3000/updateUserInfo/1


//localhost:3000/user/signUp
router.post("/signUp", auth.signUpUser)
//localhost:3000/user/signIn
router.post("/signIn", auth.signInUser)
//localhost:3000/user/refresh-tokens
router.post('/refresh-tokens', auth.refreshTokens)

module.exports = router;



