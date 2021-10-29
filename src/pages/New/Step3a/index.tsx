/* eslint-disable no-undef */
import React from 'react'
import sha256 from 'sha256'
import { useHistory } from 'react-router-dom'
import { FormControl } from 'baseui/form-control'
import { Textarea } from 'baseui/textarea'
import { Block } from 'baseui/block'
import { Input } from 'baseui/input'
import { Checkbox } from 'baseui/checkbox'
import { Button, SHAPE } from 'baseui/button'
import { H2 } from 'baseui/typography'
import { mnemonicToSeed } from '../../../lib/scripts/walletScript'

// Step2 - Create Wallet
export default function Step3a () {
  const history = useHistory()
  const [checked, setChecked] = React.useState(true)
  const [mnemonic, setMnemonic] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  const onClickCreate = React.useCallback(() => {
    extension()
    history.push('/account')
  }, [checked, mnemonic, password, confirmPassword])

  const extension = () => {
    if (!chrome.storage) {
      return
    }

    const passwordHash = sha256(password)

    mnemonicToSeed(mnemonic, passwordHash)

    chrome.storage.sync.set({ passwordHash })
  }

  return (
    <React.Fragment>
      <Block
        padding='10%'
        minHeight='100vh'
      >
        <H2>Restore your Account with Secret Recovery Phrase</H2>
        <FormControl
          label={() => 'Wallet Secret Recovery Phrase'}
        >
          <Textarea
            id="mnemonic"
            clearOnEscape
            value={mnemonic}
            onChange={event => setMnemonic(event.currentTarget.value)}
          />
        </FormControl>
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
          Restore
        </Button>
      </Block>
    </React.Fragment>
  )
}
