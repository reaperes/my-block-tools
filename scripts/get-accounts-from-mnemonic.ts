import { HDNodeWallet } from 'ethers'
import { createMnemonic } from '@src/account'

const mnemonic = createMnemonic()
// const mnemonic = ''

const maxAccount = 10
for (let i=0; i<maxAccount; i++) {
  const path = `m/44'/60'/0'/0/${i}`
  const wallet = HDNodeWallet.fromPhrase(mnemonic, '', path)
  console.log(i, wallet.address, wallet.privateKey)
}
