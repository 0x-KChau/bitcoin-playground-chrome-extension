/* eslint-disable prefer-regex-literals */
/* eslint-disable no-undef */
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
import * as WAValidator from 'wallet-address-validator'
import { crawler } from './validatorScript'

export const getAddress = (node: any, network?: any): string => {
  return bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network }).address!
}

export const generateMnemonic = (password: string): string => {
  const mnemonic = bip39.generateMnemonic()
  mnemonicToSeed(mnemonic, password)
  return mnemonic
}

export const mnemonicToSeed = (mnemonic: string, password: string) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic, password).toString('hex')
  global.chrome?.storage && global.chrome.storage.sync.set({ seed })
}

/**
   * Generate a Hierarchical Deterministic (HD) Segregated Witness (SegWit) bitcoin address from a given seed and path
   * @param {string} seed
   * @param {string} derivePath
   * @param {string} coinType
   * @param {string} network
   * @return {Array<string> | undefined}
*/
export const generateHDSigWit = ({ seed, derivePath, coinType, network } : {seed: string, derivePath?: string, coinType: string, network: string}): Array<string> => {
  const hdNode = bitcoin.bip32.fromSeed(Buffer.from(seed, 'hex'))

  if (derivePath) {
    // m/44'/0'/0'/0/0
    const validPathReg = new RegExp(/m\/44'\/0'\/0'\/[0-1]\/(?:1?\d)\b/ig)
    const validPath = validPathReg.test(derivePath)

    if (!validPath) {
      return []
    };

    const accounts = hdNode.derivePath(derivePath)
    const address = getAddress(accounts)

    return [address]
  }

  // derive the first account's node (index = 0)
  // derive the external chain node of this account
  // scan addresses of the external chain; respect the gap limit described below
  // if no transactions are found on the external chain, stop discovery
  // if there are some transactions, increase the account index and go to step 1
  const accounts: Array<string> = accountDisccory(hdNode, coinType, network)

  return accounts
}

const accountDisccory = (hdNode: any, coinType: string, network: string): Array<string> => {
  const accounts: Array<string> = []

  const childNode = hdNode
    .deriveHardened(44) // Purpose is a constant set to 44' (or 0x8000002C) following the BIP43 recommendation. It indicates that the subtree of this node is used according to this specification.
    .deriveHardened(0) // Coin type is a constant, set for each cryptocoin; 0 indicts Bitcoin
    .deriveHardened(0) // Accounts are numbered from index 0 in sequentially increasing manner.

  const GAP_LIMIT = 20
  let i = 0

  while (i < GAP_LIMIT) {
    const account = childNode
      .derive(0) // Constant 0 is used for external chain and constant 1 for internal chain
      .derive(i) // Addresses are numbered from index 0 in sequentially increasing manner.

    const address = getAddress(account)

    accounts.push(address)

    const valid = WAValidator.validate(address, coinType, network) && crawler.queue(address)

    if (!valid) {
      i = 20
      return accounts
    }

    i++
  }

  return accounts
}

/**
   * Generate an m-out-of-n Multisignature (multi-sig) Pay-To-Script-Hash (P2SH) bitcoin address, where n, m and public keys can be specified
   * @param {number} m
   * @param {number} n
   * @param {Array<string>} _publicKeys
   * @return {string}
*/
export const generateMSP2SHAddress = ({ m, n, _publicKeys }: {m: number, n: number, _publicKeys: Array<string>}): {address?: string, msg: string} => {
  try {
    // check n equals to _publicKeys.length
    if (n <= 0 || n !== _publicKeys.length) {
      return { msg: 'n out of range' }
    }

    if (m > n) {
      return { msg: 'm out of range' }
    }

    const pubkeys = _publicKeys.map(hex => Buffer.from(hex, 'hex'))

    const { address } = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wsh({
        redeem: bitcoin.payments.p2ms({ m, pubkeys })
      })
    })

    return {
      address,
      msg: 'This is Your Multi-sig P2SH Address: ' + address
    }
  } catch (error) {
    console.error(error)
    return { msg: 'Invalid public keys' }
  }
}
