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

import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { selectTab } from 'actions/ui'

export const mapStateToProps = ({ main, ui: { selectedTab } }) => ({
  tabs: Object.keys(main),
  selectedTab,
})

const Container = styled.div`
  display: flex;
`

const Tab = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${p => p.theme.color[p.isActive ? 'active' : 'inactive']};
  background-color: ${p => (p.isActive ? p.theme.base01 : p.theme.base00)};
  border-right: 1px solid ${p => p.theme.border.light};

  &:after {
    height: 100%;
    content: '';
    border-right: 1px solid ${p => p.theme.black};
  }

  span {
    padding: 0.5rem 1.5rem;
  }
`

@connect(mapStateToProps, { selectTab })
class Tabs extends Component {
  render() {
    const { tabs, selectedTab, selectTab } = this.props
    if (!tabs || !tabs.length) {
      return null
    }

    return (
      <Container>
        {tabs.map(tab => (
          <Tab onClick={() => selectTab(tab)} isActive={tab === selectedTab} key={tab}>
            <span>{tab}</span>
          </Tab>
        ))}
      </Container>
    )
  }
}

export default Tabs
