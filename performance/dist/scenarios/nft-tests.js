"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scenarios = exports.config = void 0;
const artillery_1 = require("../config/artillery");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return artillery_1.config; } });
exports.scenarios = [
    {
        name: "Get NFT Transactions",
        flow: [
            {
                function: "setupNFTRequest"
            },
            {
                get: {
                    url: '/api/v1/transactions/history',
                    qs: {
                        address: '{{ currentWallet.publicAddress }}',
                        chainId: '{{ chainId }}',
                        signature: '{{ signature }}',
                        timestamp: '{{ timestamp }}'
                    },
                    capture: {
                        json: '$.body',
                        as: 'response.body'
                    }
                }
            },
            {
                function: "logResponse"
            },
            {
                function: "verifyTransactionData"
            }
        ]
    },
    {
        name: "Get NFT Balance",
        flow: [
            {
                function: "setupNFTRequest"
            },
            {
                post: {
                    url: "/",
                    json: {
                        jsonrpc: "2.0",
                        method: "eth_call",
                        params: [
                            {
                                to: "{{ contractAddress }}",
                                data: "0x70a08231000000000000000000000000{{ currentWallet.publicAddress }}" // balanceOf(address)
                            },
                            "latest"
                        ],
                        id: 1
                    },
                    capture: {
                        json: "$.result",
                        as: "balance"
                    }
                }
            },
            {
                function: "logResponse"
            }
        ]
    },
    {
        name: "Get NFT Owner",
        flow: [
            {
                function: "setupNFTRequest"
            },
            {
                post: {
                    url: "/",
                    json: {
                        jsonrpc: "2.0",
                        method: "eth_call",
                        params: [
                            {
                                to: "{{ contractAddress }}",
                                data: "0x6352211e0000000000000000000000000000000000000000000000000000000000000001" // ownerOf(1)
                            },
                            "latest"
                        ],
                        id: 1
                    },
                    capture: {
                        json: "$.result",
                        as: "owner"
                    }
                }
            },
            {
                function: "logResponse"
            }
        ]
    }
];
