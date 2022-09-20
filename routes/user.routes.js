const router = require("express").Router();
const authController = require("../controllers/auth.ctrl");
const userController = require("../controllers/user.ctrl");

//Authentication
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

//User crud

router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unFollow);

module.exports.userRoutes = router;
