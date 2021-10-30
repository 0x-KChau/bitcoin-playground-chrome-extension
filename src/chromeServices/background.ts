/* eslint-disable no-undef */
import { DOMMessage, DOMMessageResponse } from '../types'

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('passwordHash', ({ passwordHash }) => {
    console.debug('passwordHash', passwordHash)
  })
  chrome.storage.sync.get('seed', ({ seed }) => {
    console.debug('seed', seed)
  })
  chrome.storage.sync.get('timeSession', ({ timeSession }) => {
    console.debug('timeSession', timeSession)
  })
})

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    )
  }
})

// Function called when a new message is received
const messagesFromReactAppListener = (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void) => {
  switch (msg.type) {
    case 'GET_STORAGE':
      chrome.storage.sync.get(msg.payload)
      break

    case 'SET_STORAGE':
      chrome.storage.sync.set(msg.payload)
      break

    default:
      break
  }

  sendResponse({ status: 200, message: 'Set successfully!' })

  return true
}

/**
* Fired when a message is sent from either an extension process or a content script.
*/
chrome.runtime.onMessage.addListener(messagesFromReactAppListener)
