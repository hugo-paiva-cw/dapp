require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "cloudwalk",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    cloudwalk: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};

// require('dotenv').config();

// require("@nomiclabs/hardhat-ethers");
// const { API_URL, PRIVATE_KEY } = process.env;

// /**
// * @type import('hardhat/config').HardhatUserConfig
// */
// module.exports = {
//    solidity: "0.8.7",
//    defaultNetwork: "ropsten",
//    networks: {
//       hardhat: {},
//       ropsten: {
//          url: API_URL,
//          accounts: [`0x${PRIVATE_KEY}`]
//       }
//    },
// }
