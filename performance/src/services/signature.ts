import { ethers } from 'ethers';

export class SignatureService {
  private getUTCPlusOneHour(): string {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date.toISOString();
  }

  public getNewFormatEvmRequestSignature(privateKey: string, message: string, publicAddress: string): string {
    const expiration = this.getUTCPlusOneHour();
    const fullMessage = `${message}\n\nExpiration: ${expiration}`;
    
    const wallet = new ethers.Wallet(privateKey);
    const messageBytes = ethers.utils.toUtf8Bytes(fullMessage);
    const signature = wallet.signMessage(messageBytes);

    const signatureObject = {
      type: "eth-personal",
      message: message,
      address: publicAddress,
      expiration: expiration,
      signature: signature
    };

    return Buffer.from(JSON.stringify(signatureObject)).toString('base64');
  }
} 