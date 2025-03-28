import { config as dotenvConfig } from 'dotenv';
import path from 'path';
import { scenarios } from '../scenarios/nft-tests';

dotenvConfig({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  target: "https://api-test.creditcoin.org",
  processor: scenarios,
  environments: {
    dev: {
      target: "https://api-dev.creditcoin.org",
      phases: [
        { duration: 60, arrivalRate: 1, name: 'Testing all addresses' }
      ],
      variables: {
        network: "cc3-testnet"
      }
    },
    test: {
      target: "https://api-test.creditcoin.org",
      phases: [
        { duration: 60, arrivalRate: 1, name: 'Testing all addresses' }
      ],
      variables: {
        network: "cc3-testnet"
      }
    }
  },
  addresses: {
    testAddresses: [
      "0x0c1EB5769c5B760c9F9dE8B914b95192b43b6b33",
      "0x9e9c062A4DED753089Fe5132EEf2c3999CE69374",
      "0xf68cD61F01dD40891c8CA89935ee11fbA4Be5d3C"
    ]
  },
  output: {
    csv: {
      path: "data.csv",
      columns: [
        "timestamp",
        "address",
        "network",
        "statusCode",
        "responseTime",
        "responseBody"
      ]
    }
  },
  debug: true,
  ensure: {
    maxErrorRate: 1,
    maxResponseTime: 2000
  }
}; 
