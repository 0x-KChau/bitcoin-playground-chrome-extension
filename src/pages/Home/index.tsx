/* eslint-disable no-undef */
import React from 'react'
import sha256 from 'sha256'
import { useHistory } from 'react-router-dom'
import { Input } from 'baseui/input'
import { Button, SHAPE } from 'baseui/button'
import { Block } from 'baseui/block'
import { H1, ParagraphSmall } from 'baseui/typography'
import { SnackbarElement } from 'baseui/snackbar'
import btcIcon from '../../assets/images/btc.png'

export default function Home () {
  const history = useHistory()
  const [password, setPassword] = React.useState('')
  const [passwordHash, setPasswordHash] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    _checkSessionExpiration()
    // history.push('/account')
  }, [history])

  React.useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(null), 3000)
    }
  }, [message])

  const _checkSessionExpiration = React.useCallback(() => {
    chrome.storage && chrome.storage.sync.get('timeSession', ({ timeSession }) => {
      if (timeSession) {
        const timeNow = new Date().getTime()
        if (timeNow > timeSession) {
          return _fetchPassword()
        }
        history.push('/account')
      }
    })
  }, [])

  const _fetchPassword = React.useCallback(() => {
    chrome.storage && chrome.storage.sync.get('passwordHash', ({ passwordHash }) => {
      if (passwordHash) {
        setPasswordHash(passwordHash)
      }
    })
  }, [])

  const Unlock = React.useCallback(() => history.push('/new-1'), [history])

  const handleClickUnlock = React.useCallback(() => {
    if (sha256(password) === passwordHash) {
      history.push('/account')
      const timeSession = new Date().getTime() + 1000 * 60 * 60 * 24 * 3 // expired in 3 days
      chrome.storage && chrome.storage.sync.set({ timeSession })
    } else {
      setMessage('Incorrect Password!')
    }
  }, [password])

  if (passwordHash) {
    return (
      <React.Fragment>

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
                    background: '#f6931a',
                    zIndex: 10,
                    left: '5%',
                    top: '5%'
                  }
                }
              }}
            />
          )
        }

        <Block
          position='relative'
          alignContent='center'
          minHeight='100vh'
        >
          <Block
            padding="10%"
            justifyContent='center'
            flexDirection='column'
            alignItems='center'
            display='flex'
            color='white'
          >

            <img
              src={btcIcon}
              width='100px'
              height='100px'
            />

            <H1
              $style={{ textAlign: 'center' }}
            >
              Welcome Back!
            </H1>

            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={event => setPassword(event.currentTarget.value)}
            />

            <Button
              onClick={handleClickUnlock}
              shape={SHAPE.pill}
              overrides={{
                Root: {
                  style: {
                    paddingInline: '10%',
                    marginTop: '10%',
                    width: '100%'
                  }
                }
              }}
            >
              Unlock
            </Button>

            <ParagraphSmall
              color='grey'
              onClick={() => history.push('/step-3a')}
              overrides={{
                Block: {
                  style: {
                    cursor: 'pointer'
                  }
                }
              }}
            >
              or import using Secret Recovery Phrase
            </ParagraphSmall>
          </Block>
        </Block>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Block
        position='relative'
        alignContent='center'
      >
        <Block
          justifyContent='center'
          flexDirection='column'
          alignItems='center'
          minHeight='100vh'
          display='flex'
          color='white'
          padding="5%"
        >

          <img
            src={btcIcon}
            width='100px'
            height='100px'
          />

          <H1
            $style={{ textAlign: 'center' }}
          >
            Welcome to Bitcoin Playground
          </H1>

          <Button
            onClick={Unlock}
            shape={SHAPE.pill}
            overrides={{
              Root: {
                style: {
                  paddingInline: '10%'
                }
              }
            }}
          >
            Get Started
          </Button>
        </Block>
      </Block>
    </React.Fragment>
  )
}
