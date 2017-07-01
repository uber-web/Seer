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

import { sendMessage } from 'bridge'
import { switchActive } from 'actions/ui'

@connect(({ ui: { active } }) => ({ active }), {
  switchActive,
})
class Switch extends Component {

  switch = value => () => {
    const { switchActive, active } = this.props
    if (value === active) { return }
    switchActive(value)
    sendMessage('switchCapture', { value })
  }

  render () {
    const { active } = this.props

    return (
      <div className='Switch fjc' style={{ marginLeft: 'auto' }}>

        <div
          className={active ? 'active' : ''}
          style={{ color: '#0CB825', marginRight: '0.2rem' }}
          onClick={this.switch(true)}
        >
          {'ON'}
        </div>

        <div
          className={active ? '' : 'active'}
          style={{ color: '#E80015' }}
          onClick={this.switch(false)}
        >
          {'OFF'}
        </div>

      </div>
    )
  }

}

export default Switch
