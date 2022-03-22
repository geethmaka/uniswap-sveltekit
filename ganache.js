// const Web3 = require("web3");
// import {web3} from "web3";

import Web3 from 'web3';
// const {Web3} = web3;
import { defineConfig, loadEnv } from 'vite';

// import dotenv from 'dotenv';
// const {dotenv} = dotenv;
// dotenv.config();
// require("dotenv").config();

// const ganache = require("ganache-cli");
import ganache from 'ganache-cli';


// console.log(import.meta.env.INFURA)
const options = {
  fork: `https://mainnet.infura.io/v3/0c70dbaf7ef448168e4f553df7fed683`,
  unlocked_accounts: ["0x6262998ced04146fa42253a5c0af90ca02dfd2a3"],
  account_keys_path: "keys.json",
  host: "127.0.0.1",
  port: 7545,
  seed: 1306,
};

const server = ganache.server(options);
const PORT = 7545;
server.listen(PORT, async (err, blockchain) => {
  if (err) throw err;

  console.log(`ganache listening on port ${PORT}`);
  const provider = server.provider;
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
});
