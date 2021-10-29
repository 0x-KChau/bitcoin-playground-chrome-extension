import * as React from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton
} from 'baseui/modal'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'

export default function MSP2SHModal ({ isOpen, onClose, onClickCreateMSP2SHAddress }: { isOpen: boolean, onClose: any, onClickCreateMSP2SHAddress: any }) {
  const [m, setM] = React.useState<number>(1)
  const [n, setN] = React.useState<number>(1)
  const [publicKeys, setPublicKeys] = React.useState<Array<string>>([])

  function close () {
    onClickCreateMSP2SHAddress({
      m,
      n,
      publicKeys
    })
    setM(1)
    setN(1)
    setPublicKeys([])
  }

  return (
    <React.Fragment>
      <Modal onClose={() => onClose(false)} isOpen={isOpen}>
        <ModalHeader>Create Multi-sig P2SH Address</ModalHeader>
        <ModalBody>
            <FormControl
                label={() => 'Number of signatures required'}
                caption={() => Boolean(m > n) && 'Signatures required cannot more than total Signatures'}
            >
            <Input
                id="m"
                type="number"
                value={m}
                min={1}
                onChange={event => setM(parseInt(event.currentTarget.value))}
                error={m > n}
            />
            </FormControl>
            <FormControl
                label={() => 'Number of total signatures'}
                caption={() => Boolean(n !== publicKeys.length) && 'Total Signatures should be same as total public keys'}
            >
            <Input
                id="n"
                type="number"
                value={n}
                min={1}
                onChange={event => setN(parseInt(event.currentTarget.value))}
                error={n !== publicKeys.length}
            />
            </FormControl>
            <FormControl
                label={() => 'Public keys (Seperate with ,)'}
            >
            <Input
                id="publicKeys"
                value={publicKeys.join(',')}
                onChange={event => setPublicKeys(event.currentTarget.value.split(','))}
            />
            </FormControl>
        </ModalBody>
        <ModalFooter>
          <ModalButton kind="tertiary" onClick={() => onClose(false)}>
            Cancel
          </ModalButton>
          <ModalButton disabled={n !== publicKeys.length || m > n} onClick={close}>Create</ModalButton>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}
