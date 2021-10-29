/* eslint-disable no-undef */
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Block } from 'baseui/block'
import { StatefulTooltip } from 'baseui/tooltip'
import { Value } from 'baseui/select'
import { Button } from 'baseui/button'
import { SnackbarElement } from 'baseui/snackbar'
import { H1, Label1, Label2, Label4, MonoParagraphSmall } from 'baseui/typography'
import {
  Card,
  StyledBody,
  StyledAction
} from 'baseui/card'
import { Notification, KIND } from 'baseui/notification'
import { generateHDSigWit, generateMSP2SHAddress } from '../../lib/scripts/walletScript'
import { NetworkSelector, MSP2SHModal, Divider, Hambuger } from '../../components'
import btcIcon from '../../assets/images/btc.png'

// Account Page
export default function Account () {
  const history = useHistory()
  const [seed, setSeed] = React.useState<string | null>(null)
  const [notification, setNotification] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState<string | null>(null)
  const [network, setNetwork] = React.useState<Value>([{ key: 'Testnet', value: 'testnet' }])
  const [internalAccounts, setInternalAccount] = React.useState<Array<string>>(['ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f'])
  const [externalAccounts, setExternalAccount] = React.useState<Array<string>>(['ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f'])
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    // generateHDSigWit({
    //   seed: '7202253244ee1b198bd5b3ae2321288e2fe37c7db6c6b35a118174bef6b21e180ecf26ff466f181b3e3dfe074bf6f440a9e967991e81c77373c7a2faf90f901c',
    //   coinType: 'BTC',
    //   network: network[0]?.value
    // })
    chrome.storage && chrome.storage.sync.get('seed', ({ seed }) => {
      if (seed) {
        setSeed(seed)
        const internalAccounts = generateHDSigWit({
          seed,
          coinType: 'BTC',
          derivePath: "m/44'/0'/0'/1/0",
          network: network[0]?.value
        })
        const externalAccounts = generateHDSigWit({
          seed,
          coinType: 'BTC',
          network: network[0]?.value
        })
        setInternalAccount(internalAccounts)
        setExternalAccount(externalAccounts)
      }
    })
  }, [history, network])

  React.useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(null), 3000)
    }
  }, [message])

  const onClickCopy = React.useCallback(async (account = externalAccounts[0]) => {
    await navigator.clipboard.writeText(account)
  }, [externalAccounts])

  const onClickCreateExternalAccount = React.useCallback(() => {
    console.log('seed', seed)
    if (!seed) {
      return setMessage('Something went wrong (404)')
    }

    if (externalAccounts.length >= 20) {
      return setMessage('Address gap limit is currently set to 20')
    }

    const exAccounts = generateHDSigWit({
      seed,
      coinType: 'BTC',
      network: network[0]?.value
    })

    if (externalAccounts.length === exAccounts.length) {
      return setMessage('Disallow creation of new accounts if current account has no transaction history.')
    }

    setExternalAccount(exAccounts)
  }, [seed, externalAccounts])

  const onClickCreateInternalAccount = React.useCallback(() => {
    if (!seed) {
      return setMessage('Something went wrong (404)')
    }

    if (internalAccounts.length >= 20) {
      return setMessage('Address gap limit is currently set to 20')
    }

    const inAccounts = generateHDSigWit({
      seed,
      coinType: 'BTC',
      derivePath: `m/44'/0'/0'/1/${internalAccounts.length + 1}`,
      network: network[0]?.value
    })

    setInternalAccount([...internalAccounts, ...inAccounts])
  }, [seed, internalAccounts])

  const onClickCreateMSP2SHAddress = React.useCallback(({ m, n, publicKeys }) => {
    setIsOpen(false)
    // console.log('m, n, publicKeys', m, n, publicKeys)
    const address = generateMSP2SHAddress({ m, n, _publicKeys: publicKeys })
    setNotification(address)
  }, [])

  return (
    <React.Fragment>
        <Block
            padding='15% 5%'
            minHeight='100vh'
            position='relative'
        >
            {/* Notification */}
            {
                notification && (
                    <Notification
                        kind={KIND.warning}
                        overrides={{
                          Body: {
                            style: {
                              position: 'sticky',
                              width: '100%',
                              zIndex: 10,
                              left: '5%',
                              top: '5%'
                            }
                          }
                        }}
                    >
                        {() => (
                            <Block>
                                <Label1 marginBottom='2%'>{notification}</Label1>
                                <Button onClick={() => setNotification(null)} size='mini'>
                                    Dismiss
                                </Button>
                            </Block>
                        )}
                    </Notification>
                )
            }

            {/* Message Snackbar */}
            {
                message && (
                    <SnackbarElement
                        message={message}
                        focus={true}
                        overrides={{
                          Root: {
                            style: {
                              position: 'sticky',
                              zIndex: 10,
                              left: '5%',
                              top: '5%'
                            }
                          }
                        }}
                    />
                )
            }
            <Card
                overrides={{
                  Root: {
                    style: {
                      width: '100%',
                      textAlign: 'center'
                    }
                  },
                  Body: {
                    style: {
                      position: 'relative'
                    }
                  }
                }}
            >
                <StyledBody>
                    <StatefulTooltip
                        content={() => (<MonoParagraphSmall color='white'>Copy to clipboard</MonoParagraphSmall>)}
                        placement='bottom'
                    >
                        <Block
                            onClick={onClickCopy}
                            display='flex'
                            flexDirection='column'
                            justifyContent='center'
                            overrides={{
                              Block: {
                                style: {
                                  cursor: 'pointer'
                                }
                              }
                            }}
                        >
                            <Label1 margin='0'>Account 1</Label1>
                            <Label4
                                color='grey'
                            >
                                {externalAccounts[0]?.slice(0, 6) + '...' + externalAccounts[0]?.slice(-4)}
                            </Label4>
                        </Block>
                    </StatefulTooltip>
                    {/* Hambuger */}
                    <Hambuger
                        internalAccounts={internalAccounts}
                        externalAccounts={externalAccounts}
                        onClickCopy={onClickCopy}
                        onClickCreateInternalAccount={onClickCreateInternalAccount}
                        onClickCreateExternalAccount={onClickCreateExternalAccount}
                        onClickToggleModal={setIsOpen}
                    />
                </StyledBody>

                {/* Divider */}
                <Divider />

                <StyledAction>
                    <img src={btcIcon} width='30px' height='30px' />
                    <H1 margin='0'>0 BTC</H1>
                    <Label2
                        color='grey'
                    >
                        $0.00USD
                    </Label2>
                </StyledAction>
            </Card>
        </Block>
        <NetworkSelector
            network={network}
            setNetwork={setNetwork}
        />
        {/* Modal */}
        <MSP2SHModal
            isOpen={isOpen}
            onClose={setIsOpen}
            onClickCreateMSP2SHAddress={onClickCreateMSP2SHAddress}
        />
    </React.Fragment>
  )
}
