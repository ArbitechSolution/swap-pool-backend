const express = require("express");
// const { startPool } = require("../index");
const bodyParser = require("body-parser");
const router = express.Router();
const {
  AddPool,
  GetAllPairs,
  Server,
  GetAllPairsLength,
} = require("./poolController");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.route("/").get(Server);
router.route("/addPool").post(AddPool);
router.route("/getAllPairs").get(GetAllPairs);
router.route("/getAllPairsLength").get(GetAllPairsLength);

//////

module.exports = router;
