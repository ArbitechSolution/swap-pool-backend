const express = require("express");
const cron = require("node-cron");
const poolRoutes = express.Router();
const bodyParser = require("body-parser");
const PoolModal = require("../schema/poolSchema");
const Web3 = require("Web3");
const axios = require("axios");
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
const AddPool = async (res) => {
  console.log("res", res);
  let poolRecord = new PoolModal({
    id: res.id,
    address: res.address,
    reserve0: res.reserve0,
    reserve1: res.reserve1,
    token1: res.token1,
    token2: res.token2,
    symbol1: res.symbol1,
    symbol2: res.symbol2,
  });

  await poolRecord
    .save()
    .then(() => {
      // res.status(200).json({ poolRecord: "Record save successfully" });
      console.log("Record save successfully");
    })
    .catch((err) => {
      // res.status(400).send("adding new record failed" + err);
      console.log("adding new record failed" + err);
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
  console.log("length", length);
  return length;
};
const GetAllPairsLength = async (req, res) => {
  var result = await PoolModal.count();
  //   console.log(res);
  //   res.status(200).json(result);
  return result;
};
const delay = (ms) =>
  new Promise((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
const GetRecord = async (val) => {
  console.log("into GetRecord", val);
  let token0address;
  let token1address;
  let token0symbol;
  let token1symbol;
  let resrves;
  ///get pair address
  const poolContract = new web3.eth.Contract(
    swapFactoryAbi,
    swapFactoryAddress
  );
  const getPairAdd = await poolContract.methods.allPairs(val).call();
  console.log("getPair", getPairAdd);

  await delay(1000);
  var resultAbi = await getAbi(getPairAdd);

  if (resultAbi != "Contract source code not verified") {
    const poolPairContract = new web3.eth.Contract(
      JSON.parse(resultAbi),
      getPairAdd
    );

    resrves = await poolPairContract.methods.getReserves().call();
    console.log("resrves", resrves, resrves[0], resrves._reserve1);
    token0address = await poolPairContract.methods.token0().call();
    token1address = await poolPairContract.methods.token1().call();
    console.log("address", token0address, token1address);
  }

  // await delay(1000);
  // var resultToken0Abi = getAbi(token0address);
  // const token0Contract = new web3.eth.Contract(
  //   JSON.parse(resultToken0Abi),
  //   token0address
  // );
  // token0symbol = await token0Contract.methods.symbol().call();
  token0symbol = "bnb";
  // console.log("token0symbol", token0symbol);

  // await delay(1000);
  // var resultToken1Abi = await getAbi(token1address);
  // if (resultToken1Abi != "Contract source code not verified") {
  //   const token1Contract = new web3.eth.Contract(
  //     JSON.parse(resultToken1Abi),
  //     token1address
  //   );
  //   token1symbol = await token1Contract.methods.symbol().call();
  token1symbol = "wire";
  //   console.log("token1symbol", token1symbol);
  // }
  AddPool({
    id: val,
    address: getPairAdd,
    reserve0: resrves._reserve0,
    reserve1: resrves._reserve1,
    token1: token0address,
    token2: token1address,
    symbol1: token0symbol,
    symbol2: token1symbol,
  });
};

const getAbi = async (add) => {
  let {
    data: { result },
  } = await axios.get(
    `https://api.bscscan.com/api?module=contract&action=getabi&address=${add}&apikey=C51MUEADQGQMXP87KYT9XFCSJNKC839VII`
  );
  return result;
};
// getAbi();
const CheckPoolLength = () => {
  cron.schedule("* * * * *", async () => {
    console.log("running a task every one minutes");
    var contractPairLength = await CheckPairsLengthContract();
    var databasepairLength = await GetAllPairsLength();
    console.log(
      "running a task every one minutes",
      databasepairLength,
      contractPairLength
    );
    // GetRecord(0);
    if (contractPairLength > databasepairLength) {
      for (let val = databasepairLength; val < contractPairLength; val++) {
        await GetRecord(val);
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
