interface WalletConfig {
  publicAddress: string;
  privateKey: string;
}

interface ContractConfig {
  contractAddress: string;
  chainId: string;
}

interface Environment {
  name: string;
  apiBaseUrl: string;
  contracts: {
    [key: string]: ContractConfig;
  };
  testWallets: {
    [key: string]: WalletConfig;
  };
}

const environments: { [key: string]: Environment } = {
  dev: {
    name: "Dev",
    apiBaseUrl: "http://localhost:8545",
    contracts: {
      nft: {
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // This will be updated after deployment
        chainId: "31337" // Hardhat's default chainId
      }
    },
    testWallets: {
      // Hardhat's default accounts
      account1: {
        publicAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
      },
      account2: {
        publicAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
      },
      account3: {
        publicAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        privateKey: "0x7c852118294e51e653712a81e05800f97a9a1845b5353b6c5e76d37ddf48e6d98"
      }
    }
  },
  test: {
    name: "Test",
    apiBaseUrl: "http://localhost:8545",
    contracts: {
      nft: {
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // This will be updated after deployment
        chainId: "31337" // Hardhat's default chainId
      }
    },
    testWallets: {
      // Hardhat's default accounts
      account1: {
        publicAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
      },
      account2: {
        publicAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
      },
      account3: {
        publicAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        privateKey: "0x7c852118294e51e653712a81e05800f97a9a1845b5353b6c5e76d37ddf48e6d98"
      }
    }
  }
};

export const config = {
  processor: "../utils/helpers.js",
  environments: {
    dev: {
      target: "http://localhost:8545",
      phases: [
        { duration: 60, arrivalRate: 5 }
      ],
      variables: {
        contractAddress: environments.dev.contracts.nft.contractAddress,
        chainId: environments.dev.contracts.nft.chainId,
        testWallets: environments.dev.testWallets
      }
    },
    test: {
      target: "http://localhost:8545",
      phases: [
        { duration: 60, arrivalRate: 5 }
      ],
      variables: {
        contractAddress: environments.test.contracts.nft.contractAddress,
        chainId: environments.test.contracts.nft.chainId,
        testWallets: environments.test.testWallets
      }
    }
  },
  ensure: {
    maxErrorRate: 1,
    maxResponseTime: 2000
  }
}; 
