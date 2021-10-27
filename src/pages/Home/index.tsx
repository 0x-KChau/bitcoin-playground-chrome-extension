/* eslint-disable no-undef */
import React from 'react'
import sha256 from 'sha256'
import { useHistory } from 'react-router-dom'
import { Input } from 'baseui/input'
import { Button, SHAPE } from 'baseui/button'
import { Block } from 'baseui/block'
import { H1 } from 'baseui/typography'
import { NetworkSelector } from '../../components'

export default function Home () {
  const history = useHistory()
  const [password, setPassword] = React.useState('')
  const [passwordHash, setPasswordHash] = React.useState<string | null>(null)

  React.useEffect(() => {
    chrome.storage && chrome.storage.sync.get('passwordHash', ({ passwordHash }) => {
      if (passwordHash) {
        setPasswordHash(passwordHash)
      }
    })
  }, [history])

  const Unlock = React.useCallback(() => history.push('/new-1'), [history])
  const handleClickUnlock = React.useCallback(() => {
    if (sha256(password) === passwordHash) {
      history.push('/step-2b')
    }
  }, [password])

  if (passwordHash) {
    return (
      <React.Fragment>
        <Block
          position='relative'
          alignContent='center'
        >
          <Block
              padding="0 10%"
              justifyContent='center'
              flexDirection='column'
              alignItems='center'
              minHeight='100vh'
              display='flex'
              color='white'
          >
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
                        marginTop: '10%'
                      }
                    }
                  }}
              >
              Unlock
            </Button>
          </Block>

          <NetworkSelector />
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
        >
            <H1
                $style={{ textAlign: 'center' }}
            >
                Wellcome to Bitcon Playground
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

        <NetworkSelector />
      </Block>
    </React.Fragment>
  )
}
