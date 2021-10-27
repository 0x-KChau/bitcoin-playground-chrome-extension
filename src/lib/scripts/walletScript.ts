/* eslint-disable prefer-regex-literals */
/* eslint-disable no-undef */
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const WAValidator = require('wallet-address-validator')

export const getAddress = (node: any, network?: any): string => {
  return bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network }).address!
}

export const generateMnemonic = (password: string): string => {
  const mnemonic = bip39.generateMnemonic()
  // const seed = bip39.mnemonicToSeedSync(mnemonic, password).toString('hex')
  return mnemonic
}

export const generateHDSigWit = ({ seed, derivePath, coinType, network } : {seed: string, derivePath?: string, coinType: string, network: string}): Array<string> | undefined => {
  console.log('seed, derivePath', seed, derivePath)

  const hdNode = bitcoin.bip32.fromSeed(seed)
  console.log('hdNode', hdNode)

  if (derivePath) {
    // m/44'/0'/0'/0/0
    const validPathReg = new RegExp(/m\/44'\/0'\/0'\/[0-1]\/[0-19]/ig)
    const validPath = validPathReg.test(derivePath)
    console.log('validPath', validPath)

    if (!validPath) {
      return
    };

    const account = hdNode.derivePath(derivePath)
    console.log('account', account)

    const address = getAddress(hdNode)
    console.log('address', address)

    return [address]
  }

  // derive the first account's node (index = 0)
  // derive the external chain node of this account
  // scan addresses of the external chain; respect the gap limit described below
  // if no transactions are found on the external chain, stop discovery
  // if there are some transactions, increase the account index and go to step 1
  const accounts: Array<string> = accountDisccory(hdNode, coinType, network)
  console.log('accounts', accounts)

  return accounts
}

const accountDisccory = (hdNode: any, coinType: string, network: string): Array<string> => {
  const accounts: Array<string> = []

  const childNode = hdNode
    .deriveHardened(44) // Purpose is a constant set to 44' (or 0x8000002C) following the BIP43 recommendation. It indicates that the subtree of this node is used according to this specification.
    .deriveHardened(0) // Coin type is a constant, set for each cryptocoin; 0 indicts Bitcoin
    .deriveHardened(0) // Accounts are numbered from index 0 in sequentially increasing manner.

  const GAP_LIMIT = 20

  for (let i = 0; i < GAP_LIMIT; i++) {
    const account = childNode
      .derive(0) // Constant 0 is used for external chain and constant 1 for internal chain
      .derive(i) // Addresses are numbered from index 0 in sequentially increasing manner.

    const address = getAddress(account)

    accounts.push(address)

    const valid = WAValidator.validate(address, coinType, network)

    console.log('address, valid', address, valid)

    if (!valid) {
      return accounts
    }
  }

  return accounts
}

/**
   * Generate an m-out-of-n Multisignature (multi-sig) Pay-To-Script-Hash (P2SH) bitcoin address, where n, m and public keys can be specified
   * @param {number} m
   * @param {number} n
   * @param {Array<string>} _publicKeys
   * @return {string | Error}
*/
export const generateMSP2SHAddress = ({ m, n, _publicKeys }: {m: number, n: number, _publicKeys: Array<string>}): string | Error => {
  // check n equals to _publicKeys.length
  if (n <= 0 || n !== _publicKeys.length) {
    return Error('n out of range')
  }

  if (m > n) {
    return Error('m out of range')
  }

  const pubkeys = _publicKeys.map(hex => Buffer.from(hex, 'hex'))
  console.log('pubkeys', pubkeys)

  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wsh({
      redeem: bitcoin.payments.p2ms({ m, pubkeys })
    })
  })

  console.log('address', address)
  return address
}

// const mnemonic = generateMnemonic();
// const seed = bip39.mnemonicToSeedSync(mnemonic);
// generateHDSigWit({
//     seed,
//     derivePath: "m/44'/0'/0'/0/0",
//     coinType: "BTC",
//     network: "testnet"
// });

// const _publicKeys = [
//     '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
//     '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
// ];
// generateMSP2SHAddress({
//     m: 1,
//     n: 2,
//     _publicKeys
// })
