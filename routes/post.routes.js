const express = require("express")
const { setPosts, getPosts, editPosts, deletePost, likePost, dislikePost } = require("../controllers/post.controller")
const router = express.Router()

router.get("/", getPosts)
router.post("/", setPosts)
router.put('/:id', editPosts)
router.patch("/like-post/:id", likePost)
router.patch("/dislike-post/:id", dislikePost)

router.delete("/:id", deletePost)


module.exports = router