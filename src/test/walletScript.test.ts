/* eslint-disable prefer-regex-literals */
/* eslint-disable no-undef */
import * as bip39 from 'bip39'
import * as walletScript from '../lib/scripts/walletScript'
import * as WAValidator from 'wallet-address-validator'
import * as bitcoin from 'bitcoinjs-lib'

describe('Wallet Script', () => {
  beforeAll(() => {
  })

  test('a generated mnemonic is valid', () => {
    const password = 'abcdefg123'
    const mnemonic = walletScript.generateMnemonic(password)
    const isValidated = bip39.validateMnemonic(mnemonic)

    expect(isValidated).toBeTruthy()
  })

  test('return a valid HDSigWit address if derivePath is provided', () => {
    const mnemonic = bip39.generateMnemonic()
    const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex')
    const derivePath = "m/44'/0'/0'/1/0"
    const coinType = 'BTC'
    const network = 'testnet'

    const [address] = walletScript.generateHDSigWit({
      seed,
      derivePath,
      coinType,
      network
    })

    const isValidated = WAValidator.validate(address, coinType, network)

    expect(isValidated).toBeTruthy()
  })

  test('return a valid external HDSigWit address list if no derivePath is provided', () => {
    const mnemonic = bip39.generateMnemonic()
    const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex')
    const coinType = 'BTC'
    const network = 'testnet'

    const accounts = walletScript.generateHDSigWit({
      seed,
      coinType,
      network
    })

    expect(accounts.length).toBeGreaterThanOrEqual(1)
  })

  test('return a valid m-out-of-n Multisignature (multi-sig) Pay-To-Script-Hash (P2SH) bitcoin address', () => {
    const m = 1
    const n = 2
    const _publicKeys = [
      bitcoin.ECPair.makeRandom().publicKey.toString('hex'),
      bitcoin.ECPair.makeRandom().publicKey.toString('hex')
    ]

    const result = walletScript.generateMSP2SHAddress({
      m,
      n,
      _publicKeys
    })

    const coinType = 'BTC'
    const network = 'both'
    const isValidated = WAValidator.validate(result.address, coinType, network)

    expect(isValidated).toBeTruthy()
  })
})
