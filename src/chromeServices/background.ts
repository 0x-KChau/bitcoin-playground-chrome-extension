/* eslint-disable no-undef */
import { DOMMessage, DOMMessageResponse } from '../types'

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('passwordHash', ({ passwordHash }) => {
    console.log('passwordHash', passwordHash)
  })
  chrome.storage.sync.get('seed', ({ seed }) => {
    console.log('seed', seed)
  })
  chrome.storage.sync.get('timeSession', ({ timeSession }) => {
    console.log('timeSession', timeSession)
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
  console.log('[background.js]. Message received', msg)

  switch (msg.type) {
    case 'GET_STORAGE':
      chrome.storage.sync.get(msg.payload)
      console.log('GET_STORAGE chrome.storage', chrome.storage)
      break

    case 'SET_STORAGE':
      chrome.storage.sync.set(msg.payload)
      console.log('SET_STORAGE chrome.storage', chrome.storage)
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
