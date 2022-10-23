const router = require("express").Router();
const postController = require("../controllers/post.ctrl");

router.get("/", postController.readPost);
router.get("/:id", postController.getPost);
router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

//like and unlike a post
router.patch("/like-post/:id", postController.likePost);
router.patch("/unlike-post/:id", postController.unLikePost);

//for comments

router.patch("/comment-post/:id", postController.commentPost);
router.patch("/edit-comment-post/:id", postController.editCommentPost);
router.patch("/delete-comment-post/:id", postController.deleteCommentPost);

module.exports.postRoutes = router;
