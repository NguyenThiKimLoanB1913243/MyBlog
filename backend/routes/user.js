// @ts-nocheck
const router = require("express").Router()
const User = require("../model/user")
const Post = require("../model/post")
const bcrypt = require("bcrypt")

// update
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      )
      res.status(200).json(updatedUser)
    } catch (error) {
      res.status(500).json(error)
    }
  } else {
    res.status(401).json("Ban chi co the cap nhat tai khoan")
  }
})

// delete
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    // xoa tat ca cac bai viet cua user va account cua user
    try {
      const user = await User.findById(req.params.id)
      try {
        await Post.deleteMany({ username: user.username })
        // chi xoa account cua user
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Nguoi dung da bi xoa..")
      } catch (error) {
        res.status(500).json(error)
      }
    } catch (error) {
      res.status(404).json("Khong tim thay nguoi dung")
    }
  } else {
    res.status(401).json("Ban co the xoa account")
  }
})

// get user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...other } = user._doc
    res.status(200).json(other)
  } catch (error) {
    res.status(400).json(error)
  }
})

module.exports = router