import { config } from '../config/artillery';
import { SignatureService } from '../services/signature';

const signatureService = new SignatureService();

// Export the config
export { config };

// Function to set up transaction history request
export function setupTransactionHistoryRequest(context: any, events: any, done: () => void) {
  console.log('\n=== Starting Request Setup ===');
  
  // Use the first address for testing
  const publicAddress = "0x0c1EB5769c5B760c9F9dE8B914b95192b43b6b33";
  
  // Use the environment's private key to sign
  const signature = signatureService.getNewFormatEvmRequestSignature(
    process.env.PRIVATE_KEY || '',
    'message',
    publicAddress
  );

  // Set the data for the request
  context.vars.signature = signature;
  context.vars.publicAddress = publicAddress;
  context.vars.network = context.variables.network || 'cc3-testnet';
  
  // Log the request details for debugging
  console.log('Request Variables:');
  console.log(JSON.stringify(context.vars, null, 2));
  console.log('=====================\n');
  
  return done();
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
          url: "https://api-test.creditcoin.org/history/v1/evm/{{ network }}/{{ publicAddress }}",
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
