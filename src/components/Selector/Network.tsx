import React from 'react'
import { Select, TYPE, Value } from 'baseui/select'
import { Block } from 'baseui/block'

export interface TNetwork {
  network: Value,
  setNetwork: React.Dispatch<React.SetStateAction<Value>>
}

export default function NetworkSelector ({ network, setNetwork }: TNetwork) {
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
          onChange={params => setNetwork(params.value)}
          value={network}
        />
      </Block>
    </React.Fragment>
  )
}
