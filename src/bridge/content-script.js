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

const switchCapture = value => {
  const script = document.createElement('script')
  script.textContent = `window.__SEER_INITIALIZED__ = ${value}`
  document.documentElement.appendChild(script)
  script.parentNode.removeChild(script)
}

/**
 * window -> background
 */
window.addEventListener('message', event => {
  if (event.source !== window || event.data.source !== 'seer-agent') {
    return
  }

  chrome.runtime.sendMessage(event.data)
})

/**
 * background -> window
 */
chrome.extension.onMessage.addListener(event => {
  if (event.type === 'switchCapture') {
    return switchCapture(event.payload.value)
  }

  window.postMessage(event, '*')
})
