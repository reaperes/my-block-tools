import { ethers } from 'ethers';

export function getAccounts(mnemonic: string) {
  const wallets = [];
  const maxIdx = 10;
  for (let idx = 0; idx < maxIdx; idx++) {
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
