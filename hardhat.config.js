require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */

const DEFAULT_OWNER = process.env.PRIVATE_KEY;
const DEFAULT_OWNER_2 = process.env.CC3_PRIVATE_KEY;
const DEFAULT_OWNER_3 = process.env.CC3_PRIVATE_KEY_2;

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat:{
      allowUnlimitedContractSize: true,
    },   
    localhost:{
      url: "http://localhost:8545"
    },
    cc3: {
      url: 'https://rpc.cc3-testnet.creditcoin.network',
      chainId: 102031,
      accounts: [`${DEFAULT_OWNER}`, `${DEFAULT_OWNER_2}`, `${DEFAULT_OWNER_3}`],
      gas: 5000000,
      gasPrice: 20000000000,
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      chainId: 11155111,
      accounts: [`${DEFAULT_OWNER}`],
    } 
  },
  etherscan: {
    apiKey: {
      cc3: "ABC"
    },
    customChains: [
      {
        network: "cc3",
        chainId: 102031,
        urls: {
          apiURL: "https://creditcoin-testnet.blockscout.com/api",
          browserURL: "https://creditcoin-testnet.blockscout.com/",
        },
      }
    ]
  },
};
