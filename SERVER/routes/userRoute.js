const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/addUser", userController.addUser);
router.get("/getUsers", userController.getUsers);
router.patch("/updateUser/:id", userController.updateUser);
router.delete("/deleteUser/:id", userController.deleteUser);
router.post("/loginUser", userController.loginUser);
router.get("/fetchRoleName/:roleId", userController.fetchRoleName)
module.exports = router;
