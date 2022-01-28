import { ethers } from 'ethers';

export function getAccounts(mnemonic: string, num: number = 10) {
  const wallets = [];
  for (let idx = 0; idx < num; idx++) {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${idx}`);
    wallets.push({
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
  }

  return wallets;
}

export function createMnemonic(randomByteLength: 16 | 32 = 16) {
  const entropy = ethers.utils.randomBytes(randomByteLength);
  return ethers.utils.entropyToMnemonic(entropy);
}
