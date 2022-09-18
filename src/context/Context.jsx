import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

// This imports our ABIs we'll use to interact with the contract
import Vault from "../artifacts/contracts/Vault.sol/Vault.json";
import ABI from "../artifacts/contracts/BRLC_ABI.json";

export const Context = createContext({});

export const Provider = (props) => {
  // Contracts addresses
  const vaultAddress = "0x1F9E41691fa8aC1EE8DA7398749d94CF871980e0"; // Liquidity pool contract address
  const brlcContractAddress = "0xA9a55a81a4C085EC0C31585Aed4cFB09D78dfD53";

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const vaultContract = new ethers.Contract(
    vaultAddress,
    Vault.abi,
    signer
  );
  const BRLCcontract = new ethers.Contract(brlcContractAddress, ABI, signer);

  const [inputNumber, setInputNumber] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);
  const [currentAccount, setCurrentAccount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isMetaMaskInstalled = () => {
    const { ethereum } = window;
    const isInstalled = Boolean(ethereum && ethereum.isMetaMask);
    if (!isInstalled) {
      console.log('Please install the MetaMask extension! Then you can procede to use the app.')
    }
    return isInstalled;
  };

  async function onClickConnect() {
    if (!isMetaMaskInstalled) return;

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
  if (!isMetaMaskInstalled) return;

  if (!inputNumber) {
    setErrorMessage("Por favor insira um valor");
    console.log('Error! No amount of tokens was specified for this transaction! Please specify a value.');
    return;
  }
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
  setErrorMessage = "";
}

async function addNetwork() {
  if (!isMetaMaskInstalled) return;
    
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x7D9'}]
    })
    onClickConnect();
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await addNewNetwork();
        addBrlcToken();
        addCToken();
      } catch (error) {
        console.error(error);
      }
    }
  }
  // refresh
  // window.location.reload();
};

async function addNewNetwork() {
  if (!isMetaMaskInstalled) return;

  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x7D9',
        chainName: 'CloudWalk',
        rpcUrls: ['https://rpc.services.mainnet.cloudwalk.io'],
        blockExplorerUrls: ['https://explorer.mainnet.cloudwalk.io/blocks'],
        // TODO not working icons
        iconUrls: ['https://avatars.githubusercontent.com/u/6581007?s=200&v=4', 'https://s3-eu-west-1.amazonaws.com/dealroom-images/3b/MTAwOjEwMDpjb21wYW55QHMzLWV1LXdlc3QtMS5hbWF6b25hd3MuY29tL2RlYWxyb29tLWltYWdlcy8yMDIyLzA3LzE5LzI4MDU4MjQ2NWJjMTc5MGUyNWZmYWM5MzQ2OWEzMmNk.png'],
        nativeCurrency: {
          name: 'CWN',
          symbol: 'CWN',
          decimals: 18,
        },
      },
    ],
  });
}

  async function approveAllowance(valueAssets) {
    if (!isMetaMaskInstalled) return;

    await BRLCcontract.approve(vaultAddress, valueAssets);
    const balance = await BRLCcontract.allowance(currentAccount, vaultAddress);
    console.log(parseInt(balance._hex, 16));
  }

  async function makeADeposit() {
    if (!isMetaMaskInstalled) return;

    if (!inputNumber) {
      setErrorMessage("Por favor insira um valor");
      console.log('Error! No amount of tokens was specified for this transaction! Please specify a value.');
      return;
    }
    const tenBrlcLimit = 1000;
    if (inputNumber > tenBrlcLimit) {
      setErrorMessage(`Você tentou depositar apróx BRLC ${inputNumber/100}. Por enquanto apenas depósitos até 10 reais estão disponíveis!`);
      console.log(`Error! You tried to deposit R$ ${inputNumber/100}! Please deposit a value less the 10 BRLC.`);
      return;
    }
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
    setErrorMessage = "";
  }

  async function getMaxWithdrawValue() {
    if (!isMetaMaskInstalled) return;

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
    if (!isMetaMaskInstalled) return;
    addBrlcToken();

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

  async function addBrlcToken() {
    if (!isMetaMaskInstalled) return;

    const tokenAddress = brlcContractAddress;
    const tokenSymbol = "BRLC";
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
        console.log("BRLC token was added!");
      } else {
        console.log("We couldn't add BRLC to your MetaMask!");
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
        errorMessage,
        setErrorMessage,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
