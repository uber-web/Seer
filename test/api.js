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

import test from 'ava'
import camelCase from 'lodash/camelCase'
import { spy } from 'sinon'

import api from '../api'

test('[API] check exports', t => {
  t.truthy(api, 'The global object is defined')
  t.truthy(Object.keys(api).length, 'Some methods are exported')
  t.truthy(api.send, 'The send method is defined')
})

test('[API] send', t => {

  const postMessage = spy()
  window.postMessage = postMessage

  api.send('BEFORE_INIT')
  t.is(postMessage.callCount, 0, 'postMessage should not have been called before init')

  window.__SEER_INITIALIZED__ = true

  api.send('AFTER_INIT')
  t.is(postMessage.callCount, 1, 'postMessage should now been called after init')
  t.is(postMessage.args[0][0].type, 'AFTER_INIT', 'The action type should match')

})

test('[API] listeners', t => {

  const addEventListener = spy()
  window.addEventListener = addEventListener

  api.init()
  api.init()

  t.truthy(window.__SEER_LISTENER__, 'The listener should have been defined')
  t.truthy(addEventListener.calledOnce, 'It should have added the listener')
  t.is(addEventListener.args[0][0], 'message', 'The listener should be on message events')

  t.is(api.listeners.size, 0, 'There should be no listeners')

  t.throws(api.listenFor)

  const deck = spy()
  api.listenFor('deck.gl', deck)

  t.is(api.listeners.size, 1, 'There should be a new listener added')
  t.truthy(api.listeners.has('deck.gl'), 'It should be indexed with the type')
  t.is(api.listeners.get('deck.gl').length, 1, 'It should be an array of callbacks')

  const listener = addEventListener.args[0][1]
  listener()
  listener({})
  listener({ data: { source: 'redux' } })
  listener({ data: { type: 'undefined.gl', payload: 42, source: 'seer-core' } })
  listener({ data: { type: 'deck.gl', payload: 42, source: 'seer-core' } })

  t.truthy(deck.calledOnce, 'The deck listener should have been called')
  t.is(deck.args[0][0], 42, 'With the answer')

  const removeEventListener = spy()
  window.removeEventListener = removeEventListener

  api.clean()
  api.clean()
  t.falsy(window.__SEER_LISTENER__)
  t.truthy(removeEventListener.calledOnce, 'The listener should have been removed')

  api.listenFor('deck.gl', f => f)

})

test('[API] methods', t => {

  const postMessage = spy()
  window.postMessage = postMessage
  window.__SEER_INITIALIZED__ = true

  ;['LIST', 'LIST_ITEM'].forEach((type, i) => {

    api[camelCase(type)]({ key: 'deck.gl' })
    t.is(postMessage.callCount, i + 1, 'The call count should increment each time')
    t.is(postMessage.args[i][0].source, 'seer-agent', 'The source should be correct')
    t.is(postMessage.args[i][0].type, type, 'The type should match')

  })

})
