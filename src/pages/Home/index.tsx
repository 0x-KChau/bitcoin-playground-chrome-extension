/* eslint-disable no-undef */
import React from 'react'
import { Link } from 'react-router-dom'
import { Button, SHAPE } from 'baseui/button'
import { Block } from 'baseui/block'
import { H1 } from 'baseui/typography'

import { NetworkSelector } from '../../components'
// import { DOMMessage } from './types'

export default function Home () {
  const [title, setTitle] = React.useState('click2w')
  const [headlines, setHeadlines] = React.useState<string[]>([])

  React.useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    console.log('chrome', chrome)

    chrome.storage && chrome.storage.sync.get('title', ({ title }) => {
      console.log('title', title)
      setTitle(title)
    })

    chrome.storage && chrome.storage.sync.get('headlines', ({ headlines }) => {
      console.log('headlines', headlines)
      setHeadlines(headlines)
    })
  }, [])

  // const onClick2 = async () => {
  //   if (!chrome.tabs) {
  //     return
  //   }

  //   const [tab]: any = await chrome.tabs.query({ active: true, currentWindow: true })

  //   chrome.scripting && chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     // @ts-ignore
  //     function: setMsg
  //   })
  // }

  // const setMsg = () => {
  //   const headlines = Array.from(document.getElementsByTagName<'h1'>('h1'))
  //     .map(h1 => h1.innerText)
  //   const title = document.title

  //   chrome.runtime.sendMessage(
  //     {
  //       type: 'GET_DOM',
  //       payload: { headlines, title }
  //     } as DOMMessage
  //   )
  // }

  console.log('title', title, headlines)

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
                shape={SHAPE.pill}
                overrides={{
                  Root: {
                    style: {
                      paddingInline: '10%'
                    }
                  }
                }}
            >
                <Link
                  to="/new-1"
                  style={{ color: 'white' }}
                >
                    <p>Get Started</p>
                </Link>
          </Button>
        </Block>

        <NetworkSelector />
      </Block>
    </React.Fragment>
  )
}
