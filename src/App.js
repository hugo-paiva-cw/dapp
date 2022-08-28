import { useState } from "react";
import { ethers } from "ethers";

// This imports our ABI we'll use to interact with the contract
import Greeter from "./artifacts/contracts/Lock.sol/Greeter.json";
import "./App.css";

const greeterAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function App() {
  const [message, setMessage] = useState("");
  const [currentGreeting, setCurrentGreeting] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function fetchGreeting() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        // Call Greeter.greet() and display current greeting in `console`
        /* 
      function greet() public view returns (string memory) {
        return greeting;
      }
    */
        const data = await contract.greet();
        console.log("data: ", data);
        setCurrentGreeting(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }
  async function setGreeting() {
    if (!message) return;

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      // If Metamask exists
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(message);

      setMessage("");
      await transaction.wait();
      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <div className="App-header">
        <button onClick={fetchGreeting}>Fetch greeting</button>
        <button onClick={setGreeting}>Set greeting</button>
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Set Greeting Message"
        ></input>
      </div>
    </div>
  );
}

export default App;
