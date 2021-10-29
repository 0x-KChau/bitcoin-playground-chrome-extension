/* eslint-disable no-undef */
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Block } from 'baseui/block'
import { StatefulTooltip } from 'baseui/tooltip'
import { StatefulPopover } from 'baseui/popover'
import { Menu, Plus } from 'baseui/icon'
import { Button } from 'baseui/button'
import { Label1, Label2, Label4, MonoParagraphSmall } from 'baseui/typography'
import { Card } from 'baseui/card'
import { Divider } from '../index'

export default function Hambuger ({ internalAccounts, externalAccounts, onClickCreateExternalAccount, onClickCreateInternalAccount, onClickCopy, onClickToggleModal }: { internalAccounts: Array<string>, externalAccounts: Array<string>, onClickCreateExternalAccount: any, onClickCreateInternalAccount: any, onClickCopy: any, onClickToggleModal: any }) {
  const history = useHistory()

  const onClickLock = React.useCallback(() => {
    chrome.storage && chrome.storage.sync.set({ timeSession: 1 })
    history.push('/')
  }, [])

  return (
    <Block
        position='absolute'
        right='2%'
        top='2%'
        overrides={{
          Block: {
            style: {
              cursor: 'pointer'
            }
          }
        }}
    >
        <StatefulPopover
            accessibilityType={'tooltip'}
            placement={'bottomRight'}
            overrides={{
              Body: {
                style: {
                  width: '60%',
                  background: 'rgba(0,0,0,0.3)'
                }
              },
              Arrow: {
                style: {
                  background: 'rgba(0,0,0,0.3)'
                }
              },
              Inner: {
                style: {
                  background: 'rgba(0,0,0,0.3)'
                }
              }
            }}
            content={
                <Card
                    overrides={{
                      Root: {
                        style: {
                          width: '100%',
                          background: 'rgba(0,0,0,0.3)',
                          borderRadius: '0'
                        }
                      }
                    }}
                >
                    <Block
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                    >
                        <Label2 margin='0' color='white'>My Accounts</Label2>
                        <Button size='mini' onClick={onClickLock}>Lock</Button>
                    </Block>

                    {/* Divider */}
                    <Divider styles={{ marginTop: '5%' }} />

                    <Label1 margin='5% 0' color='white'>Internal Account</Label1>
                    {
                        internalAccounts.map((account: string, index: number) => (
                            <StatefulTooltip
                                key={index}
                                content={() => (<MonoParagraphSmall color='white'>Copy to clipboard</MonoParagraphSmall>)}
                                placement='bottom'
                            >
                                <Block
                                    onClick={() => onClickCopy(account)}
                                    display='flex'
                                    alignItems='center'
                                    overrides={{
                                      Block: {
                                        style: {
                                          flexWrap: 'wrap',
                                          cursor: 'pointer'
                                        }
                                      }
                                    }}
                                >
                                    <Label2 margin='0' color='white'>Account {index + 1}</Label2>
                                    <Label2 color='lightgrey' marginLeft='5%'>0 BTC</Label2>
                                    <Label4 color='lightgrey'>{account?.slice(0, 10) + '...' + account?.slice(-10)}</Label4>
                                </Block>
                            </StatefulTooltip>
                        ))
                    }

                    {/* Divider */}
                    <Divider styles={{ marginTop: '5%' }} />

                    <Label1 margin='5% 0' color='white'>External Account</Label1>
                    {
                        externalAccounts.map((account: string, index: number) => (
                            <StatefulTooltip
                                key={index}
                                content={() => (<MonoParagraphSmall color='white'>Copy to clipboard</MonoParagraphSmall>)}
                                placement='bottom'
                            >
                                <Block
                                    onClick={() => onClickCopy(account)}
                                    display='flex'
                                    alignItems='center'
                                    overrides={{
                                      Block: {
                                        style: {
                                          flexWrap: 'wrap',
                                          cursor: 'pointer'
                                        }
                                      }
                                    }}
                                >
                                    <Label2 margin='0' color='white'>Account {index + 1}</Label2>
                                    <Label2 color='lightgrey' marginLeft='5%'>0 BTC</Label2>
                                    <Label4 color='lightgrey'>{account?.slice(0, 10) + '...' + account?.slice(-10)}</Label4>
                                </Block>
                            </StatefulTooltip>
                        ))
                    }

                    {/* Divider */}
                    <Block marginTop='5%' />

                    <Button
                        onClick={onClickCreateInternalAccount}
                    >
                        <Plus size={20} color='white' />
                        <Label2 margin='0' color='white'>Create Internal Account</Label2>
                    </Button>

                    {/* Divider */}
                    <Divider styles={{ marginTop: '5%' }} />

                    <StatefulTooltip
                        content={() => (<MonoParagraphSmall color='white'>This follows BIP39 standard about Multi-Account Hierarchy for Deterministic Wallets</MonoParagraphSmall>)}
                        placement='bottom'
                    >
                        <Button
                            onClick={onClickCreateExternalAccount}
                        >
                            <Plus size={20} color='white' />
                            <Label2 margin='0' color='white'>Create External Account</Label2>
                        </Button>
                    </StatefulTooltip>

                    {/* Divider */}
                    <Divider styles={{ marginTop: '5%' }} />

                    <StatefulTooltip
                        content={() => (<MonoParagraphSmall color='white'>This will generate an m-out-of-n Multisignature (multi-sig) Pay-To-Script-Hash (P2SH) bitcoin address, where n, m and public keys can be specified</MonoParagraphSmall>)}
                        placement='bottom'
                    >
                        <Button
                            onClick={onClickToggleModal}
                        >
                            <Plus size={20} color='white' />
                            <Label2 margin='0' color='white'>Create Multi-sig P2SH Address</Label2>
                        </Button>
                    </StatefulTooltip>
                </Card>
            }
        >
            <Menu size={24} />
        </StatefulPopover>
    </Block>
  )
}
