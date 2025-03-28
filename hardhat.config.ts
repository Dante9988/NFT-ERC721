import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import { HardhatUserConfig } from "hardhat/config";
import { config as configDotenv } from "dotenv";

configDotenv();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    cc3: {
      url: 'https://rpc.cc3-testnet.creditcoin.network',
      chainId: 102031,
      accounts: [`${process.env.PRIVATE_KEY}`],
      gas: 5000000,
      gasPrice: 20000000000,
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

export default config; 