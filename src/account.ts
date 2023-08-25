import { generateMnemonic } from 'ethereum-cryptography/bip39'
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english'

export function createMnemonic(): string {
  return generateMnemonic(wordlist)
}
