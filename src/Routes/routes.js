const express = require("express");
const router = express.Router();
const userInfo = require("../Controllers/userInfo");
const auth = require("../Controllers/auth");
const files = require("../Controllers/files");

//localhost:3000/user/showUserInfo/1
router.get("/showUserInfo/:id", userInfo.showUserInfo);
//localhost:3000/updateUserInfo/1
router.put("/updateUserInfo/:id", userInfo.updateUserInfo);
//localhost:3000/updateUserInfo/1
router.post("/postUserAvatar/:id", userInfo.postUserAvatar);

//localhost:3000/showFile/1
router.get("/showFiles/:id", files.showFiles);
//localhost:3000/uploadFile/1
router.post("/uploadFile/:id", files.postUnloadFile);
//localhost:3000/downloadFile/1
router.post("/deleteFile/:id", files.deleteFile);

//localhost:3000/user/signUp
router.post("/signUp", auth.signUpUser);
//localhost:3000/user/signIn
router.post("/signIn", auth.signInUser);
//localhost:3000/user/refresh-tokens
router.post("/refresh-tokens", auth.refreshTokens);
//localhost:3000/resetPassword/
router.post("/resetPassword", auth.resetPassword);
//localhost:3000/createNewPassword/
router.post("/createNewPassword", auth.createNewPassword);

module.exports = router;
