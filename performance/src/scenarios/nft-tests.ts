import { config } from '../config/artillery';
import { SignatureService } from '../services/signature';

const signatureService = new SignatureService();

// Export the config
export { config };

// Function to set up transaction history request
export async function setupTransactionHistoryRequest(context: any, events: any) {
  console.log('\n=== Starting Request Setup ===');
  
  // Get the public address from variables
  const publicAddress = context.variables.publicAddress;
  console.log('Public Address:', publicAddress);
  // Use the environment's private key to sign
  const signature = await signatureService.getNewFormatEvmRequestSignature(
    process.env.PRIVATE_KEY || '',
    'message',
    publicAddress  // Pass the public address to signature generation
  );

  // Set the data for the request
  context.vars = {
    signature,
    publicAddress,
    network: "102031"
  };
  
  // Log the request details for debugging
  console.log('Request Variables:');
  console.log('Public Address:', publicAddress);
  console.log('Network:', context.vars.network);
  console.log('Signature:', signature);
  console.log('Private Key Set:', !!process.env.PRIVATE_KEY);
  console.log('=====================\n');
}

// Function to log response details
export function logResponseDetails(context: any, events: any) {
  console.log('\n=== Response Received ===');
  const response = context.response;
  console.log('Response Object:', JSON.stringify(response, null, 2));
  console.log('==================\n');
}

// Function to log error details
export function logError(context: any, events: any) {
  console.log('\n=== Error Occurred ===');
  console.log('Context:', JSON.stringify(context, null, 2));
  console.log('Events:', JSON.stringify(events, null, 2));
  console.log('==================\n');
}

// Transaction history scenario
export const scenarios = [
  {
    name: "Get Transaction History",
    flow: [
      {
        function: "setupTransactionHistoryRequest"
      },
      {
        get: {
          url: "/history/v1/evm/{{ network }}/{{ publicAddress }}",
          headers: {
            "REQUEST-SIGNATURE": "{{ signature }}",
            "Content-Type": "application/json"
          },
          capture: {
            json: "$",
            as: "transactionHistory"
          },
          expect: {
            statusCode: 200
          }
        }
      },
      {
        function: "logResponseDetails"
      }
    ],
    afterScenario: "logError"
  }
];
