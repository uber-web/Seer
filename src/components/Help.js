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

import React from 'react'

export default () => (
  <div className='Help'>

    <div className='fjc'>
      <img src='https://cdn.pbrd.co/images/eJImDurl.png' height='100' />
    </div>

    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      {'No data has been yet received. To hook into Seer, you\'ll have follow these steps:'}
    </div>
    <div>
      {'1) Install the package as a dependency'}
      <pre className='code'>{'yarn add seer'}</pre>
    </div>
    <div>
      {'2) Use one of the provided methods to send messages'}
      <pre className='code'>{'import seer from \'seer\'\n\n...\n\nseer.listItem(\'test-tab\', \'yolo\', {})'}</pre>
    </div>
    <div>
      {'3) Use listenFor if you want to receive messages'}
      <pre className='code'>{'seer.listenFor(\'test-tab\', msg => console.log(msg))'}</pre>
    </div>

  </div>
)
