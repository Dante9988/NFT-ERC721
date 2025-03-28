"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureService = void 0;
const ethers_1 = require("ethers");
class SignatureService {
    getUTCPlusOneHour() {
        const date = new Date();
        date.setHours(date.getHours() + 1);
        return date.toISOString();
    }
    getNewFormatEvmRequestSignature(privateKey, message) {
        const expiration = this.getUTCPlusOneHour();
        const fullMessage = `${message}\n\nExpiration: ${expiration}`;
        const wallet = new ethers_1.ethers.Wallet(privateKey);
        const messageBytes = ethers_1.ethers.utils.toUtf8Bytes(fullMessage);
        const signature = wallet.signMessage(messageBytes);
        const signatureObject = {
            type: "eth-personal",
            message: message,
            address: wallet.address,
            expiration: expiration,
            signature: signature
        };
        return Buffer.from(JSON.stringify(signatureObject)).toString('base64');
    }
}
exports.SignatureService = SignatureService;
