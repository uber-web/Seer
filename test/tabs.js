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

import Tabs, { mapStateToProps } from 'components/Tabs'

const doWrap = (props = {}) => mount(<Tabs.WrappedComponent {...props} />)

test('[Core] Tabs mapStateToProps', t => {

  const props = mapStateToProps({ main: { deck: {}, luma: {} }, ui: { selectedTab: 'yolo' } })
  t.is(props.selectedTab, 'yolo', 'The passed selected tab should be consistent')
  t.deepEqual(props.tabs, ['deck', 'luma'], 'There should be two tabs')
})

test('[Core] Tabs render', t => {

  t.is(doWrap().children().length, 0, 'There should be no children')

  const selectTab = spy()
  const wrap = doWrap({ selectTab, tabs: ['deck.gl', 'luma.gl'] })
  t.truthy(wrap.children().length, 'Now it should render something')
  t.is(wrap.find('.Tab').length, 2, 'There should be two tabs')

  wrap.setProps({ selectedTab: 'deck.gl' })

  const firstTab = wrap.find('.Tab').first()
  t.truthy(firstTab.hasClass('active'), 'The first tab should now be active')

  firstTab.simulate('click')
  t.truthy(selectTab.calledOnce, 'The select tab should have been called')
  t.is(selectTab.args[0][0], 'deck.gl', 'It should match the tab key')

})
