<script>
import { Web3 } from "svelte-web3";
  import { onMount } from "svelte";
  import Dex from "../abis/Dex.json";
  import ERC20Mock from "../abis/ERC20Mock.json";
const USDC_MAINNET = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDC_DECIMALS = 6;

let dexContract;
let Accounts;
let tokenContract;
let metamaskConnected=false;

let EthCount;
let USDCCount;

let NumberOfETH = 0;
let NumberOfUSDC = 0;

$: EthCount;
$: USDCCount;

async function connectWallet() {
  const _web3 = new Web3(ethereum);
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    await window.ethereum.enable();
    metamaskConnected = window.ethereum.isConnected();
    Accounts = await _web3.eth.getAccounts();
    const _EthCount = await web3.eth.getBalance(Accounts[0]);
    EthCount = web3.utils.fromWei(_EthCount.toString(), "ether");

    tokenContract = new web3.eth.Contract(ERC20Mock.abi, USDC_MAINNET);
    let _tokenBalance = await tokenContract.methods
      .balanceOf(Accounts[0])
      .call();
    USDCCount = 10 * Math.pow(_tokenBalance, USDC_DECIMALS);

    const networkId = await web3.eth.net.getId();
    const dexData = Dex.networks[networkId];
    if (dexData) {
      dexContract = new web3.eth.Contract(Dex.abi, dexData.address);
    } else {
      window.alert("Dex contract not deployed to detected network");
    }
  }
}

const swapEthHandler = async () => {
  if (dexContract) {
    await dexContract.methods
      .swapEthForUSDC(web3.utils.toWei(NumberOfETH.toString(), "ether"))
      .send({
        value: web3.utils.toWei(NumberOfETH.toString(), "ether"),
        from: Accounts[0],
      });

    const _Ethcount = await web3.eth.getBalance(Accounts[0]);
    EthCount = web3.utils.fromWei(_Ethcount.toString(), "ether");
    const _USDCCount = await tokenContract.methods
      .balanceOf(Accounts[0])
      .call();
    USDCCount = 10 * Math.pow(_USDCCount, USDC_DECIMALS);
    console.log(_USDCCount);
  }
};

const swapUSDCHandler = async () => {
  if (dexContract) {
    const networkId = await web3.eth.net.getId();
    const dexData = Dex.networks[networkId];
    if (dexData) {
      const sendUSDC = 10 * Math.pow(10, USDC_DECIMALS);
      await tokenContract.methods.approve(dexData.address, sendUSDC).send({
        from: Accounts[0],
      });
      await dexContract.methods
        .swapUSDCForEth(sendUSDC)
        .send({ from: investor });
      EthCount = await web3.eth.getBalance(Accounts[0]);
      USDCCount = await tokenContract.methods.balanceOf(Accounts[0]).call();
    } else {
      window.alert("Dex contract not deployed to detected network");
    }
  }
};

onMount(()=>{
connectWallet();
metamaskConnected = window.ethereum
  ? window.ethereum.isConnected()
  : false;

console.log(metamaskConnected);
})


</script>
<svelte:window/>
<main>
  <span>No. of ETH: {EthCount}</span>
  <input type="number" bind:value={NumberOfETH} />
  <button on:click={swapEthHandler}>Swap ETH</button>
  <br />
  <span>No. of USDC: {USDCCount}</span>
  <input type="number" bind:value={NumberOfUSDC} />
  <button on:click={swapUSDCHandler}>Swap USDC</button>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
</style>
