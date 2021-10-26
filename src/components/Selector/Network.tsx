import React from 'react'
import { Select, TYPE, Value } from 'baseui/select'
import { Block } from 'baseui/block'

export default function NetworkSelector () {
  const [value, setValue] = React.useState<Value>([{ key: 'Testnet', value: 'testnet' }])

  return (
    <React.Fragment>
      <Block
        position='absolute'
        top='0'
        right='0'
      >
        <Select
          options={[
            { key: 'Testnet', value: 'testnet' },
            { key: 'Mainnet', value: 'mainnet' }
          ]}
          labelKey="key"
          valueKey="value"
          placeholder="Choose a network"
          maxDropdownHeight="300px"
          type={TYPE.search}
          onChange={({ value }) => setValue(value)}
          value={value}
        />
      </Block>
    </React.Fragment>
  )
}
