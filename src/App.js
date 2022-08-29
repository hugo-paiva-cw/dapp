import { useState } from "react";
import { ethers } from "ethers";

// This imports our ABI we'll use to interact with the contract
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import "./App.css";

const greeterAddress = "0xed578BAd241455C0d57419659a3a6Eb9c770cC8d";

function App() {
  const [message, setMessage] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const isMetaMaskInstalled = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  // const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

  // const onClickInstall = () => {
  //   onboarding.startOnboarding();
  // };

  const onClickConnect = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("oi");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
    } catch (error) {
      console.error(error);
    }
  };

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

  // getApproval.addEventListener("click", async () => {
  //   const result = ethereum.request({ method: "approve" });
  // });

  // getAccountsButton.addEventListener("click", async () => {
  //   const accounts = await ethereum.request({ method: "eth_accounts" });
  //   getAccountsResult.innerHTML =
  //     accounts[0] || "Não foi capaz de obter as contas";
  // });

  MetaMaskClientCheck();

  async function makeADeposit() {
    // If MetaMask exists
    if (!message) return;
    const valueAssets = message * 10000;
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      try {
        // Call Greeter.greet() and display current greeting in `console`
        /* 
      function greet() public view returns (string memory) {
        return greeting;
      }
    */
        // const data = await contract.totalSupply();
        const data = await contract.deposit(
          valueAssets,
          "0x0D50AB2b552A2D2e6cdaFd367e6e78f392A2f06F"
        );
        console.log("data: ", data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }
  async function doNothingAndAddToken() {
    if (!message) return;

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      // If Metamask exists
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      // const transaction = await contract.makeADeposit(message);

      // setMessage("");
      // await transaction.wait();
      // doNothingAndAddToken();
      addCToken();
    }
  }
  async function makeAWithdraw() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      try {
        // const data = await contract.totalSupply();
        const maxWithdraw = await contract.maxWithdraw(
          "0x0D50AB2b552A2D2e6cdaFd367e6e78f392A2f06F"
        );
        const data = await contract.withdraw(
          maxWithdraw,
          "0x0D50AB2b552A2D2e6cdaFd367e6e78f392A2f06F",
          "0x0D50AB2b552A2D2e6cdaFd367e6e78f392A2f06F"
        );
        console.log("data: ", data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function getMaxWithdrawValue() {
    const unitsInACent = 10000;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
    const maxWithdraw = await contract.maxWithdraw(
      "0x0D50AB2b552A2D2e6cdaFd367e6e78f392A2f06F"
    );
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
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <div>Meu balanço atual é: {currentBalance} centavos</div>
      <div className="App-header">
        <button onClick={getMaxWithdrawValue}>Ver saldo</button>
        <button onClick={onClickConnect}>Conectar</button>
        <button onClick={doNothingAndAddToken}>
          Adicionar cToken a MetaMask
        </button>
        <button onClick={makeADeposit}>Depositar</button>
        <button onClick={makeAWithdraw}>Sacar Tudo</button>
        <input
          type="number"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Digite quantos centavos"
        ></input>
      </div>
    </div>
  );
}

export default App;
