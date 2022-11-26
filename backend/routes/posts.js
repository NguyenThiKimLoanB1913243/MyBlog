// @ts-nocheck
const router = require("express").Router()
const Post = require("../model/post")

// tao bai viet
router.post("/", async (req, res) => {
  const newPost = new Post(req.body)
  try {
    const savePost = await newPost.save()
    res.status(200).json(savePost)
  } catch (error) {
    res.status(500).json(error)
  }
})

// cap nhat bai viet
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.username === req.body.username) {
      try {
        const updatePost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        )
        res.status(200).json(updatePost)
      } catch (error) {
        res.status(500).json(error)
      }
    } else {
      res.status(401).json("Ban co the cap nhat bai viet cua ban!")
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

// xoa bai viet
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.username === req.body.username) {
      try {
        await post.delete()
        res.status(200).json("Bai viet da duoc xoa!")
      } catch (error) {
        res.status(500).json(error)
      }
    } else {
      res.status(401).json("Ban chi co the xoa bai viet cua ban!")
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

// lay bai viet
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.status(200).json(post)
  } catch (error) {
    res.status(404).json(error)
  }
})

// lay tat ca cac bai viet
router.get("/", async (req, res) => {
  const username = req.query.user
  const catName = req.query.cat
  try {
    let posts
    if (username) {
      posts = await Post.find({ username: username })
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      })
    } else {
      posts = await Post.find()
    }
    res.status(200).json(posts)
  } catch (error) {
    res.status(404).json(error)
  }
})

module.exports = router
