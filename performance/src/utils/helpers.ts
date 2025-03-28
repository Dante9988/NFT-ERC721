import { SignatureService } from '../services/signature';

interface WalletConfig {
  publicAddress: string;
  privateKey: string;
}

interface Context {
  vars: {
    testWallets: {
      [key: string]: WalletConfig;
    };
    contractAddress: string;
    chainId: string;
    signature?: string;
    timestamp?: string;
    response?: {
      body: any;
    };
    responseTime?: number;
    currentWallet?: WalletConfig;
  };
}

interface Events {
  emit(event: string, name: string, value: number): void;
}

const signatureService = new SignatureService();

export function setupNFTRequest(context: Context, events: Events, done: Function): void {
  // Randomly select a wallet for this request
  const wallets = Object.values(context.vars.testWallets);
  const randomWallet = wallets[Math.floor(Math.random() * wallets.length)];
  context.vars.currentWallet = randomWallet;

  const signature = signatureService.getNewFormatEvmRequestSignature(
    randomWallet.privateKey,
    'message'
  );

  context.vars.signature = signature;
  context.vars.timestamp = new Date().toISOString();
  return done();
}

export function logResponse(context: Context, events: Events, done: Function): void {
  const response = context.vars.response;
  const walletAddress = context.vars.currentWallet?.publicAddress;
  
  events.emit('counter', 'responses', 1);
  events.emit('histogram', 'response_time', context.vars.responseTime || 0);
  
  if (response?.body && response.body.length > 0) {
    events.emit('counter', 'transactions_found', 1);
    if (walletAddress) {
      events.emit('counter', `transactions_${walletAddress}`, 1);
    }
  }

  return done();
}

interface Transaction {
  type: string;
  module: string;
  name: string;
}

export function verifyTransactionData(context: Context, events: Events, done: Function): void {
  const response = context.vars.response;
  const walletAddress = context.vars.currentWallet?.publicAddress;
  
  if (response?.body && Array.isArray(response.body)) {
    const nftTransfers = response.body.filter((tx: Transaction) => 
      tx.type === 'ERC721Transfer' || 
      tx.module === 'nft' || 
      tx.name === 'transfer'
    );
    
    events.emit('counter', 'nft_transfers_found', nftTransfers.length);
    if (walletAddress) {
      events.emit('counter', `nft_transfers_${walletAddress}`, nftTransfers.length);
    }
  }

  return done();
} 