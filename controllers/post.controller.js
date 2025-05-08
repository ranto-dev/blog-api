const postModels = require("../models/post.models")
const PostModel = require("../models/post.models")

module.exports.getPosts = async (req, res) => {
    const posts = await PostModel.find()
    res.status(200).json(posts)
}

module.exports.setPosts = async (req, res) => {
    if(!req.body.message) {
        res.status(400).json({ message: "Merci d'ajouter un message" })
    }

    const post = await PostModel.create({
        message: req.body.message,
        author: req.body.author,
    })

    res.status(200).json(post)
} 

module.exports.editPosts = async (req, res) => {
    const post = await postModels.findById(req.params.id)

    if(!post) {
        res.status(400).json({ message: "Ce post n'existe pas!" })
    }

    const updatePost = await PostModel.findByIdAndUpdate(
        post,
        req.body,
        { new : true }
    )

    res.status(200).json(updatePost)
}

module.exports.deletePost = async (req, res) => {
    const post = await postModels.findById(req.params.id)

    if(!post) {
        res.status(400).json({ message: "Ce post n'existe pas!" })
    }

    await post.deleteOne()
    res.status(200).json({ message: "Post supprimé avec l'id " + req.params.id })
}

module.exports.likePost = async (req, res) => {
    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: {
                    likers: req.body.userId
                }
            }
            ,
            { new: true }
        ).then((data) => res.status(200).json(data))
    } catch (err) {
        res.status(400).json(err)
    }
}

module.exports.dislikePost = async (req, res) => {
    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    likers: req.body.userId
                }
            }
            ,
            { new: true }
        ).then((data) => res.status(200).json(data))
    } catch (err) {
        res.status(400).json(err)
    }
}