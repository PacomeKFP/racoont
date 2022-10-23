const router = require("express").Router();
const authController = require("../controllers/auth.ctrl");
const uploadController = require("../controllers/upload.ctrl");
const userController = require("../controllers/user.ctrl");
const multer = require("multer");
const upload = multer({ dest: "../client/public/uploads/profil/" });

//Authentication
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

//User crud

router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

//follow & unfollow
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unFollow);

//upload
router.post("/upload", upload.single("file"));
// router.post("/upload", uploadController.uploadProfil);
router.post("/dir", uploadController.dir);

module.exports.userRoutes = router;
