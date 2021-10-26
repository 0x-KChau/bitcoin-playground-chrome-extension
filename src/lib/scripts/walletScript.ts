/* eslint-disable no-undef */
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')

export const getAddress = (node: any, network?: any): string => {
  return bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network }).address!
}

export const generateMnemonic = (password: string): string => {
  const mnemonic = bip39.generateMnemonic()
  const seed = bip39.mnemonicToSeedSync(mnemonic, password)
  console.log('mnemonic', mnemonic)
  console.log('seed', seed)
  // storeSeed(seed)
  return seed
}
