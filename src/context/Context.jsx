import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

// This imports our ABIs we'll use to interact with the contract
import Greeter from "../artifacts/contracts/Greeter.sol/Greeter.json";
import ABI from "../artifacts/contracts/BRLC_ABI.json";

export const Context = createContext({});

export const Provider = (props) => {
  // Contracts addresses
  const greeterAddress = "0x1F9E41691fa8aC1EE8DA7398749d94CF871980e0"; // Liquidity pool contract address
  const brlcContractAddress = "0xA9a55a81a4C085EC0C31585Aed4cFB09D78dfD53";

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

async function makeAWithdraw() {
  console.log('foi clicado');
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

async function addNetwork() {
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x7D9',
        chainName: 'CloudWalk',
        rpcUrls: ['https://rpc.services.mainnet.cloudwalk.io'],
        nativeCurrency: {
          name: 'CWN',
          symbol: 'CWN',
          decimals: 18,
        },
      },
    ],
  });
  // refresh
  window.location.reload();
};

// async function getMaxWithdrawValue() {
//   const unitsInACent = 10000;
//   const maxWithdraw = await vaultContract.getMyBalance(currentAccount);
//   const result = parseInt(maxWithdraw._hex, 16);
//   setCurrentBalance(result / unitsInACent);
//   console.log(result);
//   return result;
// }

  async function approveAllowance(valueAssets) {
    await BRLCcontract.approve(greeterAddress, valueAssets);
    const balance = await BRLCcontract.allowance(currentAccount, greeterAddress);
    console.log(parseInt(balance._hex, 16));
  }

  async function makeADeposit() {
    console.log('depo')
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

  // async function makeAWithdraw() {
  //   if (!inputNumber) return;
  //   const valueAssets = inputNumber * 10000;
  //   if (typeof window.ethereum !== "undefined") {
  //     try {
  //       const data = await vaultContract.withdraw(
  //         valueAssets,
  //         currentAccount,
  //         currentAccount
  //       );
  //       console.log("data: ", data);
  //     } catch (error) {
  //       console.log("Error: ", error);
  //     }
  //   }
  // }

  async function getMaxWithdrawValue() {
    const unitsInACent = 10000;
    const oldOne = await vaultContract.getMyBalance(currentAccount);
    console.log(oldOne);
    const maxWithdraw = await vaultContract.maxWithdraw(currentAccount);
    console.log(`O saldo é ${maxWithdraw}`);
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
    const tokenAddress = greeterAddress;
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

  const navigate = useNavigate();

  return (
    <Context.Provider
      value={{
        navigate,
        onClickConnect,
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
        addNetwork,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
