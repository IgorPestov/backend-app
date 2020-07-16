const express = require("express");
const router = express.Router();
const userInfo = require("../Controllers/userInfo");
const auth = require("../Controllers/auth");
const files = require("../Controllers/files");

router.get("/showUserInfo/:id", userInfo.showUserInfo);
router.put("/updateUserInfo/:id", userInfo.updateUserInfo);
router.post("/postUserAvatar/:id", userInfo.postUserAvatar);

router.get("/showFiles/:id", files.showFiles);
router.post("/uploadFile/:id", files.postUnloadFile);
router.post("/deleteFile/:id", files.deleteFile);

router.post("/signUp", auth.signUpUser);
router.post("/signIn", auth.signInUser);
router.post("/refresh-tokens", auth.refreshTokens);
router.post("/resetPassword", auth.resetPassword);
router.post("/createNewPassword", auth.createNewPassword);

module.exports = router;
