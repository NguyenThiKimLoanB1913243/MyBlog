// @ts-nocheck
const router = require("express").Router()
const User = require("../model/user")
const bcrypt = require("bcrypt")

// dang ky
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt)

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    })

    const user = await newUser.save()
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error)
  }
})

// dang nhap
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    //neu khong co user
    !user && res.status(400).json("Khong co nguoi dung nay!")
    //neu cung mot user thi so sanh mat khau
    const validate = await bcrypt.compare(req.body.password, user.password)
    //neu khong xac thuc
    !validate && res.status(400).json("Sai thong tin xac thuc!")

    const { password, ...other } = user._doc
    res.status(200).json(other)
  } catch (error) {
    res.status(500).json(error)
  }
})
module.exports = router
