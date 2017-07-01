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
import React from 'react'
import { spy } from 'sinon'
import { mount } from 'enzyme'

import { defaultItem } from 'reducers/main'
import Content, { mapStateToProps } from 'components/Content'

const doWrap = (props = {}) => mount(<Content.WrappedComponent {...props} />)

test('[CORE] Content mapStateToProps', t => {

  const props = mapStateToProps({
    ui: { tabs: ['deck.gl'], selectedTab: 'deck.gl', selectedItem: [] },
    main: { 'deck.gl': { arc: { badges: ['9000fps'] } } },
  })

  t.is(props.selectedTab, 'deck.gl', 'The tab should be passed')
  t.deepEqual(props.selectedItem, [], 'There should be no selected item')
  t.deepEqual(props.data, { arc: { badges: ['9000fps'] } }, 'The data should be equal')

})

test('[CORE] Content render help', t => {

  const wrap = doWrap()
  t.truthy(wrap.find('.Help').length, 'The help should be rendered')

})

test('[CORE] Content render list', t => {

  const selectItem = spy()
  const wrap = doWrap({
    data: { path: defaultItem, arc: defaultItem },
    selectedTab: 'deck.gl',
    selectedItem: [],
    selectItem,
  })

  t.is(wrap.find('.list-item').length, 2, 'There should be three items')

  const firstItem = wrap.find('.list-item .item-title').first()
  t.is(firstItem.text(), 'arc', 'It should be sorted and the displayed text should be the key')

  firstItem.simulate('click')
  t.deepEqual(selectItem.args[0][0], ['arc'], 'It should select the arc layer')
  wrap.setProps({ selectedItem: ['arc'] })

  // t.truthy(firstItem.find('.json-root').length, 'The json tree should be there')

  // const postMessage = spy()
  // window.postMessage = postMessage

  // const updateValue = firstItem.find('.json-root').children().prop('onChange')
  // updateValue({ keyPath: [0, 'zoom', 'data'], value: 42 })

  // t.truthy(postMessage.calledOnce, 'Post message should have been called')
  // t.is(postMessage.args[0][0].type, 'deck.gl', 'It should be the current tab type')
  // t.is(postMessage.args[0][0].payload.type, 'edit', 'It should be an edit event')
  // t.deepEqual(postMessage.args[0][0].payload.valuePath, ['data', 'zoom', 0], 'It should have reversed the path')
  // t.is(postMessage.args[0][0].payload.value, 42, 'The value should be the answer ;)')

})
