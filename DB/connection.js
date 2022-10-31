const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const URL = "mongodb://localhost:27017/MyDB";
const Connection = async () => {
  mongoose.connect(
    "mongodb+srv://faheem:faheem1234@cluster0.fgjqlhi.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  );
  // mongoose.connect(URL, {
  //   useNewUrlParser: true,
  // });
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("database connection established successfully");
  });
};
module.exports = Connection;
