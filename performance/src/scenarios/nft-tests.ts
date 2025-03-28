import { config } from '../config/artillery';
import { SignatureService } from '../services/signature';

const signatureService = new SignatureService();

// Export the config
export { config };

// Function to set up transaction history request
export function setupTransactionHistoryRequest(context: any, events: any, done: () => void) {
  // Get a random address from our test addresses
  const publicAddress = getRandomAddress(config.addresses.testAddresses);
  
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
  return done();
}

// Helper function to get random address
function getRandomAddress(addresses: string[]) {
  return addresses[Math.floor(Math.random() * addresses.length)];
}

// Function to log response details
export function logResponseDetails(context: any, events: any) {
  const response = context.response;
  console.log('\n=== API Response ===');
  console.log(`Address: ${context.vars.publicAddress}`);
  console.log(`Network: ${context.vars.network}`);
  console.log(`Status Code: ${response.statusCode}`);
  console.log(`Response Time: ${response.timings.phases.firstByte}ms`);
  console.log('Response Body:', JSON.stringify(response.body, null, 2));
  console.log('==================\n');
}

// Function to log error details
export function logError(context: any, events: any) {
  console.log('\n=== API Error ===');
  console.log(`Address: ${context.vars.publicAddress}`);
  console.log(`Network: ${context.vars.network}`);
  console.log(`Error: ${context.error}`);
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
            "REQUEST-SIGNATURE": "{{ signature }}"
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
