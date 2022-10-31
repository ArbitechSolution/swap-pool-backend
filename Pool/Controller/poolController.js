const express = require("express");
const cron = require("node-cron");
const poolRoutes = express.Router();
const bodyParser = require("body-parser");
const PoolModal = require("../schema/poolSchema");
const Web3 = require("Web3");
const RPCURL = process.env.RPC_URL;
const web3 = new Web3(new Web3.providers.HttpProvider(RPCURL));
// var Web3=require("web3");
// var web3= new Web3('ws://localhost:8545');
const {
  swapFactoryAbi,
  swapFactoryAddress,
} = require("../../utils/swapFactory");
poolRoutes.use(bodyParser.json());
//// server checking
const Server = async (req, res) => {
  res.status(200).send("Server is Running on Full Speed");
};

///add pool
// poolRoutes.route("/addPool").post(async (req, res) => {
const AddPool = async (req, res) => {
  console.log(req.body);
  let poolRecord = new PoolModal({
    id: req.body?.id,
    address: req.body?.address,
    reserve0: req.body?.reserve0,
    reserve1: req.body?.reserve1,
    token1: req.body?.token1,
    token2: req.body?.token2,
  });
  // let poolRecord = await PoolModal.create({
  //   id: req.body?.id,
  //   address: req.body?.address,
  //   reserve0: req.body?.reserve0,
  //   reserve1: req.body?.reserve1,
  //   token1: req.body?.token1,
  //   token2: req.body?.token2,
  // });

  await poolRecord
    .save()
    .then(() => {
      res.status(200).json({ poolRecord: "Record save successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new record failed" + err);
    });
};
// get all pool
const GetAllPairs = async (req, res) => {
  PoolModal.find((err, pool) => {
    if (err) {
      res.status(400).send("error :" + err);
    } else {
      res.status(200).json(pool);
    }
  });
};
const CheckPairsLengthContract = async (req, res) => {
  const poolContract = new web3.eth.Contract(
    swapFactoryAbi,
    swapFactoryAddress
  );
  const length = await poolContract.methods.allPairsLength().call();
  return length;
};
const GetAllPairsLength = async (req, res) => {
  var result = await PoolModal.count();
  //   console.log(res);
  //   res.status(200).json(result);
  return result;
};
const GetRecord = async (val) => {
  console.log("into GetRecord");
  ///get pair address
  const poolContract = new web3.eth.Contract(
    swapFactoryAbi,
    swapFactoryAddress
  );
  const getPair = await poolContract.methods.allPairs(val).call();
  console.log("getPair", getPair);
  var contract = web3.eth.abi(swapFactoryAddress);
  console.log("contract contract", contract);
};
const CheckPoolLength = () => {
  cron.schedule("*/1 * * * *", async () => {
    var contractPairLength = await CheckPairsLengthContract();
    var databasepairLength = await GetAllPairsLength();
    console.log(
      "running a task every one minutes",
      databasepairLength,
      contractPairLength
    );

    if (contractPairLength > databasepairLength) {
      for (let val = databasepairLength; val < contractPairLength; val++) {
        GetRecord(val);
      }
    }
  });
};
module.exports = {
  AddPool,
  GetAllPairs,
  Server,
  GetAllPairsLength,
  CheckPoolLength,
  CheckPairsLengthContract,
};
