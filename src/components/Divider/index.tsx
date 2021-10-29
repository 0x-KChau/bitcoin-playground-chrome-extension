import React from 'react'
import { Block } from 'baseui/block'

export const Divider = ({ styles }: { styles?: React.CSSProperties }) => {
  return (
          <Block
              overrides={{
                Block: {
                  style: {
                    ...styles,
                    borderBottom: '1px solid lightgrey',
                    marginBottom: '5%'
                  }
                }
              }}
          />
  )
}
