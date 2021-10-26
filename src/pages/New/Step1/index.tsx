import React from 'react'
import { Link } from 'react-router-dom'
import { Block } from 'baseui/block'
import {
  Card,
  StyledBody,
  StyledAction
} from 'baseui/card'
import { Button, SHAPE } from 'baseui/button'
import { StatefulTooltip } from 'baseui/tooltip'

export interface TCard {
  title: string, tooltop: string, buttonText: string, link: string
}

export default function Step1 () {
  return (
    <React.Fragment>
      <Block
        padding="0 10%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight='100vh'
      >
        {
          cards.map((card: TCard) => (
            <Card
              key={card.title}
              overrides={{
                Root: {
                  style: {
                    width: '100%',
                    textAlign: 'center',
                    margin: '5%'
                  }
                }
              }}
            >
              <StyledBody>
                <StatefulTooltip
                    content={() => (
                      <p>
                        {card.tooltop}
                      </p>
                    )}
                    placement="topRight"
                  >
                  {card.title}
                </StatefulTooltip>
              </StyledBody>
              <StyledAction>
                <Button
                  shape={SHAPE.pill}
                  overrides={{
                    BaseButton: { style: { width: '100%' } }
                  }}
                >
                  <Link
                    to={card.link}
                    style={{ color: 'white' }}
                  >
                    {card.buttonText}
                  </Link>
                </Button>
              </StyledAction>
            </Card>
          ))
        }
      </Block>
    </React.Fragment>
  )
}

const cards: Array<TCard> = [
  {
    title: 'No, I already have a Secret Recovery Phrase',
    tooltop: 'Import your existing wallet using a Secret Recovery Phrase',
    buttonText: 'Import Wallet',
    link: '/step-2b'
  },
  {
    title: 'Yes, let’s get set up!',
    tooltop: 'This will create a new wallet and Secret Recovery Phrase',
    buttonText: 'Create a Wallet',
    link: '/step-2a'
  }
]
