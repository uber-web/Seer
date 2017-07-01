// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* eslint-disable no-console */
const connections = {}

/**
 * content-script -> devtools
 */
chrome.runtime.onMessage.addListener((message, sender) => {
  console.log('[Bridge] Message from window', message)
  if (!sender.tab) { return console.warn('[Bridge] Please specify a tab.') }

  const tab = connections[sender.tab.id]
  if (!tab) { return console.warn('[Bridge] Tab not connected') }

  tab.postMessage(message)
})

/**
 * Upon tab reloading, reset the data
 */
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (!connections[tabId] || info.status !== 'complete') { return }
  connections[tabId].postMessage({ type: 'RESET', payload: '{}', source: 'seer-bridge' })
})

/**
 * devtools -> content-script
 */
chrome.runtime.onConnect.addListener(port => {

  if (port.name !== 'seer') { return }

  const toolsListener = message => {
    console.log('[Bridge] Message to window', message)

    if (message.type === 'init') {
      connections[message.tabId] = port
      port.onDisconnect.addListener(() => {
        delete connections[message.tabId]
        // port.onMessage.removeListener(toolsListener)
      })
    }

    const { type, payload, source } = message

    chrome.tabs.sendMessage(message.tabId, { type, payload, source })
  }

  port.onMessage.addListener(toolsListener)

})
