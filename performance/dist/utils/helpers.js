"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTransactionData = exports.logResponse = exports.setupNFTRequest = void 0;
const signature_1 = require("../services/signature");
const signatureService = new signature_1.SignatureService();
function setupNFTRequest(context, events, done) {
    // Randomly select a wallet for this request
    const wallets = Object.values(context.vars.testWallets);
    const randomWallet = wallets[Math.floor(Math.random() * wallets.length)];
    context.vars.currentWallet = randomWallet;
    const signature = signatureService.getNewFormatEvmRequestSignature(randomWallet.privateKey, 'message');
    context.vars.signature = signature;
    context.vars.timestamp = new Date().toISOString();
    return done();
}
exports.setupNFTRequest = setupNFTRequest;
function logResponse(context, events, done) {
    var _a;
    const response = context.vars.response;
    const walletAddress = (_a = context.vars.currentWallet) === null || _a === void 0 ? void 0 : _a.publicAddress;
    events.emit('counter', 'responses', 1);
    events.emit('histogram', 'response_time', context.vars.responseTime || 0);
    if ((response === null || response === void 0 ? void 0 : response.body) && response.body.length > 0) {
        events.emit('counter', 'transactions_found', 1);
        if (walletAddress) {
            events.emit('counter', `transactions_${walletAddress}`, 1);
        }
    }
    return done();
}
exports.logResponse = logResponse;
function verifyTransactionData(context, events, done) {
    var _a;
    const response = context.vars.response;
    const walletAddress = (_a = context.vars.currentWallet) === null || _a === void 0 ? void 0 : _a.publicAddress;
    if ((response === null || response === void 0 ? void 0 : response.body) && Array.isArray(response.body)) {
        const nftTransfers = response.body.filter((tx) => tx.type === 'ERC721Transfer' ||
            tx.module === 'nft' ||
            tx.name === 'transfer');
        events.emit('counter', 'nft_transfers_found', nftTransfers.length);
        if (walletAddress) {
            events.emit('counter', `nft_transfers_${walletAddress}`, nftTransfers.length);
        }
    }
    return done();
}
exports.verifyTransactionData = verifyTransactionData;
