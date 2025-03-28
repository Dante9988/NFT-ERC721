"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const environments = {
    dev: {
        name: "Dev",
        apiBaseUrl: "https://api-dev.creditcoin.org/",
        contracts: {
            cc3Testnet: {
                contractAddress: "0xbB24c8DaC3cBe2021F3E3823724CE19f08B81135",
                chainId: "102031"
            }
        },
        testWallets: {
            uniswapSingleExactInput: {
                publicAddress: "0x5a474e98eAC9137D929f4cdBAA92710E014Cd30f",
                privateKey: "5ab8ddffc464185a2864521e47c3c74fdb82ce69c46ad6d88c46c4b940c3cab5"
            },
            uniswapSingleExactOutput: {
                publicAddress: "0xBCE481A6E87af5237BcDB541c334fc8357c5423C",
                privateKey: "b40a962747b510ea233085de762dc77b9a4f69a419dbeaf668fcd27594770f34"
            },
            uniswapSplitExactInput: {
                publicAddress: "0x6E6d41a65F31FC301c0e65c5d299EfFC5e641e67",
                privateKey: "2120212b72a219f199c8dc15abb300790dd6b1143f391cb96c30bb8ced523502"
            }
        }
    },
    test: {
        name: "Test",
        apiBaseUrl: "https://api-test.creditcoin.org/",
        contracts: {
            cc3Testnet: {
                contractAddress: "0xbB24c8DaC3cBe2021F3E3823724CE19f08B81135",
                chainId: "102031"
            }
        },
        testWallets: {
            uniswapSingleExactInput: {
                publicAddress: "0x5a474e98eAC9137D929f4cdBAA92710E014Cd30f",
                privateKey: "5ab8ddffc464185a2864521e47c3c74fdb82ce69c46ad6d88c46c4b940c3cab5"
            },
            uniswapSingleExactOutput: {
                publicAddress: "0xBCE481A6E87af5237BcDB541c334fc8357c5423C",
                privateKey: "b40a962747b510ea233085de762dc77b9a4f69a419dbeaf668fcd27594770f34"
            },
            uniswapSplitExactInput: {
                publicAddress: "0x6E6d41a65F31FC301c0e65c5d299EfFC5e641e67",
                privateKey: "2120212b72a219f199c8dc15abb300790dd6b1143f391cb96c30bb8ced523502"
            }
        }
    }
};
exports.config = {
    processor: "../utils/helpers.js",
    environments: {
        dev: {
            target: "http://localhost:8545",
            phases: [
                { duration: 60, arrivalRate: 5 }
            ],
            variables: {
                contractAddress: environments.dev.contracts.cc3Testnet.contractAddress,
                chainId: environments.dev.contracts.cc3Testnet.chainId,
                testWallets: environments.dev.testWallets
            }
        },
        test: {
            target: "http://localhost:8545",
            phases: [
                { duration: 60, arrivalRate: 5 }
            ],
            variables: {
                contractAddress: environments.test.contracts.cc3Testnet.contractAddress,
                chainId: environments.test.contracts.cc3Testnet.chainId,
                testWallets: environments.test.testWallets
            }
        }
    },
    ensure: {
        maxErrorRate: 1,
        maxResponseTime: 2000
    }
};
