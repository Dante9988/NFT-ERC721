import { config } from '../config/artillery';
import { setupNFTRequest, logResponse, verifyTransactionData } from '../utils/helpers';

export { config };

export const scenarios = [
  {
    name: "Mint NFT",
    flow: [
      {
        function: "setupNFTRequest"
      },
      {
        post: {
          url: "/",
          json: {
            jsonrpc: "2.0",
            method: "eth_sendTransaction",
            params: [
              {
                from: "{{ currentWallet.publicAddress }}",
                to: "{{ contractAddress }}",
                value: "0x2386f26fc10000", // 0.01 ETH
                data: "0xa0712d680000000000000000000000000000000000000000000000000000000000000001" // mint(1)
              }
            ],
            id: 1
          },
          capture: {
            json: "$.result",
            as: "mintTxHash"
          }
        }
      },
      {
        function: "logResponse"
      }
    ]
  },
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
