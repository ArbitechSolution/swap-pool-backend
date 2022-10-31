const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const Connection = require("./DB/connection");
const PoolRoutes = require("./Pool/Controller/router");
// const { CheckPoolLength } = require("./Pool/controller");
const { CheckPoolLength } = require("./Pool/Controller/poolController");
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", PoolRoutes);

app.listen(port, () => {
  Connection();
  CheckPoolLength();
  console.log("server is running on port : " + port);
});
