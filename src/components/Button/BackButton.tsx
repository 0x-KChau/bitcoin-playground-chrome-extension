import React from 'react'
import { useHistory } from 'react-router-dom'
import { Block } from 'baseui/block'
import { ChevronLeft } from 'baseui/icon'

export default function BackButton () {
  const history = useHistory()
  const handleBack = React.useCallback(() => history.goBack(), [history])

  return (
    <React.Fragment>
        <Block
          onClick={handleBack}
          position='absolute'
          top='5%'
          left='5%'
          overrides={{
            Block: {
              style: {
                zIndex: 19,
                cursor: 'pointer'
              }
            }
          }}
        >
          <ChevronLeft size='24px'/>
        </Block>
    </React.Fragment>
  )
}
