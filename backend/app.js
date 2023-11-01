const express = require("express")
const mongoose = require("mongoose")
const Room = require("./Models/room")
require('dotenv').config()
const cors = require("cors")
const app = express()
app.use(cors())

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("connect to database"));

//임시 방
app.get("/", async(req, res)=>{
  Room.insertMany([
    {
      room: "자바스크립트 단톡방",
      members: [],
    },
    {
      room: "리액트 단톡방",
      members: [],
    },
    {
      room: "NodeJS 단톡방",
      members: [],
    },
  ])
  .then(() => res.send("ok"))
  .catch((error) => res.send(error));
})

module.exports = app;