import { useState } from "react";
import { ethers } from "ethers";

// This imports our ABIs we'll use to interact with the contract
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import ABI from "./artifacts/contracts/brlcABI.json";
import "./App.css";

// Contracts addresses
const vaultAddress = "0xed578BAd241455C0d57419659a3a6Eb9c770cC8d"; // Liquidity pool contract address
const brlcContractAddress = "0xC6d1eFd908ef6B69dA0749600F553923C465c812";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const vaultContract = new ethers.Contract(vaultAddress, Greeter.abi, signer);
const BRLCcontract = new ethers.Contract(brlcContractAddress, ABI, signer);

function App() {
  const [inputNumber, setInputNumber] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);
  const [currentAccount, setCurrentAccount] = useState("");

  const isMetaMaskInstalled = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  // const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

  // const onClickInstall = () => {
  //   onboarding.startOnboarding();
  // };

  async function onClickConnect() {
    try {
      const res = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(res[0] || "Não foi capaz de obter as contas");
      console.log(currentAccount);
    } catch (error) {
      console.error(error);
    }
  }

  const MetaMaskClientCheck = () => {
    // if (!isMetaMaskInstalled()) {
    //   onboardButton.innerText = "Clique aqui para instalar MetaMask!";
    //   onboardButton.onclick = onClickInstall;
    //   onboardButton.disabled = true;
    // } else {
    //   onboardButton.innerText = "Conectar";
    //   onboardButton.onclick = onClickConnect;
    //   onboardButton.disabled = false;
    //   depositButton.disabled = false;
    // }
  };

  MetaMaskClientCheck();

  async function approveAllowance() {
    const myWallet = currentAccount;
    const lpAddress = "0xed578BAd241455C0d57419659a3a6Eb9c770cC8d";
    await BRLCcontract.approve(lpAddress, 100000);
    const balance = await BRLCcontract.allowance(myWallet, lpAddress);
    console.log(parseInt(balance._hex, 16));
  }

  async function makeADeposit() {
    if (!inputNumber) return;
    const valueAssets = inputNumber * 10000;
    if (typeof window.ethereum !== "undefined") {
      await approveAllowance();
      try {
        const data = await vaultContract.deposit(valueAssets, currentAccount);
        console.log("data: ", data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function makeAWithdraw() {
    if (!inputNumber) return;
    const valueAssets = inputNumber * 10000;
    if (typeof window.ethereum !== "undefined") {
      try {
        const data = await vaultContract.withdraw(
          valueAssets,
          currentAccount,
          currentAccount
        );
        console.log("data: ", data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function getMaxWithdrawValue() {
    const unitsInACent = 10000;
    const maxWithdraw = await vaultContract.maxWithdraw(currentAccount);
    const result = parseInt(maxWithdraw._hex, 16);
    const resultInCents = result / unitsInACent;
    const resulInReal = resultInCents / 100;
    const maskedNumber = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(resulInReal);
    setCurrentBalance(maskedNumber);
    console.log(maskedNumber);
    return maskedNumber;
  }

  async function addCToken() {
    const tokenAddress = vaultAddress;
    const tokenSymbol = "cBRLC";
    const tokenDecimals = 6;
    const tokenImage = "https://nft.infinitepay.io/images/frame-brlc.svg";

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("cBRLC token was added!");
      } else {
        console.log("We couldn't add cBRLC to your MetaMask!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <div className="App-header">
        <div>Meu balanço atual é: {currentBalance}</div>
        <div>Minha conta é: {currentAccount}</div>
        <button onClick={getMaxWithdrawValue}>Ver saldo</button>
        <button onClick={onClickConnect}>Conectar</button>
        <button onClick={addCToken}>Adicionar cToken a MetaMask</button>
        <button onClick={makeADeposit}>Depositar</button>
        <button onClick={makeAWithdraw}>Sacar Tudo</button>
        <input
          type="number"
          onChange={(e) => setInputNumber(e.target.value)}
          value={inputNumber}
          placeholder="Digite quantos centavos"
        ></input>
      </div>
    </div>
  );
}

export default App;
