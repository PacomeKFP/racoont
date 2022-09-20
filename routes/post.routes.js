const router = require("express").Router();
const postController = require("../controllers/post.ctrl");

router.get("/", postController.readPost);
router.get("/:id", postController.getPost);
router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

router.patch("/like-post/:id", postController.likePost);
router.patch("/unlike-post/:id", postController.unLikePost);

module.exports.postRoutes = router;
