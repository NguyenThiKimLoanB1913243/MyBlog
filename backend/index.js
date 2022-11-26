// @ts-nocheck
const express = require("express")
const app = express()
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const db = "mongodb+srv://loanb1913243:loanb1913243@cluster-blog.ccwfa3f.mongodb.net/?retryWrites=true&w=majority"

const multer = require("multer")
const path = require("path")


const authRoute = require("./routes/auth")
const authUser = require("./routes/user")
const authPost = require("./routes/posts")
const authCat = require("./routes/categories")


dotenv.config()
app.use(express.json())
app.use("/images", express.static(path.join(__dirname, "/images")))

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDb"))
  .catch((err) => console.log(err))

const storage = multer.diskStorage({
  destination: (req, file, callb) => {
    callb(null, "images")
  },
  filename: (req, file, callb) => {
    //callb(null, "file.png")
    callb(null, req.body.name)
  },
})
const upload = multer({ storage: storage })
app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File da duoc tai len!")
})

app.use("/auth", authRoute)
app.use("/users", authUser)
app.use("/posts", authPost)
app.use("/category", authCat)


app.listen("3000", () => {
  console.log("Backend running...")
})