/* eslint-disable no-undef */
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Block } from 'baseui/block'
import { Textarea } from 'baseui/textarea'
import { Button, SHAPE } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { H2 } from 'baseui/typography'
import { generateMnemonic } from '../../../lib/scripts/walletScript'

// Step2 - Create Wallet
export default function Step2a () {
  const history = useHistory()
  const [mnemonic, setMnemonic] = React.useState<string>('')

  React.useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.storage && chrome.storage.sync.get('passwordHash', ({ passwordHash }) => {
      const mnemonic = generateMnemonic(passwordHash)
      setMnemonic(mnemonic)
    })
  }, [history])

  const onClickRedirect = React.useCallback(() => {
    const timeSession = new Date().getTime() + 1000 * 60 * 60 * 24 * 3 // expired in 3 days
    chrome.storage && chrome.storage.sync.set({ timeSession })
    history.push('/account')
  }, [])

  return (
    <React.Fragment>
      <Block
        padding='10%'
        minHeight='100vh'
      >
        <H2>Secret Recovery Phrase</H2>
        <FormControl
          caption={() => "*DO NOT share this phrase with anyone! These words can be used to steal all your accounts. You can't edit or change your Secret Recovery Phrase."}
        >
          <Textarea
            value={mnemonic}
            disabled
            error
            positive
            placeholder="Secret Recovery Phrase"
          />
        </FormControl>
        <Button
          shape={SHAPE.pill}
          overrides={{
            BaseButton: { style: { width: '100%', marginTop: '10%' } }
          }}
          onClick={onClickRedirect}
        >
          Let&apos;s Go
        </Button>
      </Block>
    </React.Fragment>
  )
}
