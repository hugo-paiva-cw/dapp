import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

// This imports our ABIs we'll use to interact with the contract
import Greeter from "../artifacts/contracts/Greeter.sol/Greeter.json";
import ABI from "../artifacts/contracts/BRLC_ABI.json";

export const Context = createContext({});

export const Provider = (props) => {
  // Contracts addresses
  const greeterAddress = "0xed578BAd241455C0d57419659a3a6Eb9c770cC8d"; // Liquidity pool contract address
  const brlcContractAddress = "0xC6d1eFd908ef6B69dA0749600F553923C465c812";

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const vaultContract = new ethers.Contract(
    greeterAddress,
    Greeter.abi,
    signer
  );
  const BRLCcontract = new ethers.Contract(brlcContractAddress, ABI, signer);

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
  setCurrentBalance(result / unitsInACent);
  console.log(result);
  return result;
}

  async function approveAllowance(valueAssets) {
    const myWallet = currentAccount;
    const lpAddress = "0xed578BAd241455C0d57419659a3a6Eb9c770cC8d";
    await BRLCcontract.approve(lpAddress, valueAssets);
    const balance = await BRLCcontract.allowance(myWallet, lpAddress);
    console.log(parseInt(balance._hex, 16));
  }

  async function makeADeposit() {
    if (!inputNumber) return;
    const valueAssets = inputNumber * 10000;
    if (typeof window.ethereum !== "undefined") {
      await approveAllowance(valueAssets);
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
    setCurrentBalance(result / unitsInACent);
    console.log(result);
    return result;
  }

  async function addCToken() {
    const tokenAddress = greeterAddress;
    const tokenSymbol = "cBRLC";
    const tokenDecimals = 6;
    const tokenImage = "http://placekitten.com/200/300";

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

  const navigate = useNavigate();

  return (
    <Context.Provider
      value={{
        navigate,
        onClickConnect,
        MetaMaskClientCheck,
        makeADeposit,
        makeAWithdraw,
        getMaxWithdrawValue,
        approveAllowance,
        addCToken,
        isMetaMaskInstalled,
        inputNumber,
        setInputNumber,
        currentBalance,
        setCurrentBalance,
        currentAccount,
        setCurrentAccount,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
