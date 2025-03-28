import { ethers } from 'ethers';

export class SignatureService {
  private getUTCPlus24Hours(): string {
    const date = new Date();
    date.setHours(date.getHours() + 24); // changed from +1 to +24
    return date.toISOString();
  }

  public async getNewFormatEvmRequestSignature(privateKey: string, message: string, publicAddress: string = ""): Promise<string> {
    const expiration = this.getUTCPlus24Hours();
    const fullMessage = `${message}\n\nExpiration: ${expiration}`;
    
    const wallet = new ethers.Wallet(privateKey);
    const messageBytes = ethers.utils.toUtf8Bytes(fullMessage);
    const signature = await wallet.signMessage(messageBytes);

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