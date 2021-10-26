/* eslint-disable no-undef */
import React from 'react'
import { FormControl } from 'baseui/form-control'
import { Block } from 'baseui/block'
import { Input } from 'baseui/input'
import { Checkbox } from 'baseui/checkbox'
import { Button, SHAPE } from 'baseui/button'
import { H2 } from 'baseui/typography'
import { generateMnemonic } from '../../../lib/scripts/walletScript'
import { DOMMessage } from '../../../types'

// Step2 - Create Wallet
export default function Step2a () {
  const [checked, setChecked] = React.useState(true)
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [seed, setSeed] = React.useState<string | null>(null)

  const onClickCreate = React.useCallback(() => {
    console.log('onClickCreate', checked, password, confirmPassword)
    const seed = generateMnemonic(password)
    console.log('seed', seed)
    setSeed(seed)
    storeSeed(seed)
  }, [checked, password, confirmPassword])

  const storeSeed = async (seed: string): Promise<void> => {
    if (!chrome.tabs) {
      return
    }

    const [tab]: any = await chrome.tabs.query({ active: true, currentWindow: true })
    console.log('storeSeed', seed)

    chrome.scripting && chrome.scripting.executeScript({
      target: { tabId: tab.id },
      // @ts-ignore
      function: sendChromeMsg
    })
  }

  const sendChromeMsg = () => {
    console.log('sendChromeMsg seed', seed)
    chrome.runtime.sendMessage(
      {
        type: 'SET_STORAGE',
        payload: { seed }
      } as DOMMessage
    )
  }

  return (
    <React.Fragment>
      <Block
        padding='10%'
        minHeight='100vh'
      >
        <H2>Create Password</H2>
        <FormControl
          label={() => 'Password (min 8 chars)'}
          caption={() => Boolean(password.length) && password.length < 8 && 'Password at least 8 chars'}
        >
          <Input
            id="password"
            type="password"
            value={password}
            onChange={event => setPassword(event.currentTarget.value)}
            error={password.length < 8}
          />
        </FormControl>
        <FormControl
          label={() => 'Confirm password'}
          caption={() => Boolean(confirmPassword.length) && confirmPassword !== password && "Passwords Don't Match"}
        >
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.currentTarget.value)}
            error={confirmPassword !== password}
          />
        </FormControl>
        <FormControl>
          <Checkbox
            checked={checked}
            onChange={() => setChecked(!checked)}
          >
            I have read and agree to the Terms of Use
          </Checkbox>
        </FormControl>
        <Button
          shape={SHAPE.pill}
          overrides={{
            BaseButton: { style: { width: '100%' } }
          }}
          disabled={Boolean(password.length < 8 || confirmPassword !== password)}
          onClick={onClickCreate}
        >
          Create
        </Button>
      </Block>
    </React.Fragment>
  )
}
