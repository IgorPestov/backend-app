const express = require("express");
const router = express.Router();
const controllers = require("../Controllers/controllers")

//localhost:3000/user/signUp
router.post("/signUp", controllers.signUpUser)
//localhost:3000/user/signIn
router.post("/signIn", controllers.signInUser)
//localhost:3000/user/showUserInfo/1
router.get("/showUserInfo/:id", controllers.showUserInfo)
//localhost:3000/updateUserInfo/1
router.put("/updateUserInfo/:id", controllers.updateUserInfo)
//localhost:3000/showFile/1
router.get("/showFile/:id", controllers.showFile)
//localhost:3000/uploadFile/1
router.put("/uploadFile/:id", controllers.putDownloadFile)
//localhost:3000/downloadFile/1
router.get("/downloadFile/:id", controllers.getUnloadFile)

module.exports = router;



