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
import MapGL from 'react-map-gl'
import DeckGL, { LineLayer, ArcLayer, ScatterplotLayer } from 'deck.gl'
import { sendMessage } from 'bridge'

@connect()
class Demo extends Component {
  state = {
    viewport: {
      latitude: 37.78,
      longitude: -122.41,
      zoom: 13.5,
      bearing: 180,
      pitch: 60,
      startDragLngLat: null,
    },
  }

  componentDidMount() {
    sendMessage('init')

    window.addEventListener('message', msg => {
      if (msg.data.source === 'seer-core' && msg.data.type === 'switchCapture') {
        window.__SEER_INITIALIZED__ = msg.data.payload.value
      }
      if (msg.data.source !== 'seer-agent') {
        return
      }
      const { type, payload } = msg.data
      this.props.dispatch({ type, payload: JSON.parse(payload) })
    })
  }

  render() {
    const { viewport } = this.state

    const layers = [
      new ArcLayer({
        id: 'arc-layer',
        strokeWidth: 10,
        data: [
          {
            sourcePosition: [-122.4, 37.7843],
            targetPosition: [-122.416, 37.781],
            color: [255, 0, 255],
          },
        ],
      }),
      new ScatterplotLayer({
        id: 'scatterplot-layer',
        data: [{ position: [-122.4, 37.78], radius: 5, color: [0, 255, 0] }],
        radiusScale: 100,
      }),
      new LineLayer({
        id: 'line-layer',
        strokeWidth: 10,
        data: [
          {
            sourcePosition: [-122.43, 37.79],
            targetPosition: [-122.416, 37.781],
            color: [255, 0, 0],
          },
        ],
      }),
    ]

    return (
      <div>
        <MapGL
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
          onViewportChange={v => this.setState({ viewport: v })}
          dragRotate
          width={500}
          height={window.innerHeight}
          {...viewport}
        >
          <DeckGL {...viewport} layers={layers} width={500} height={window.innerHeight} />
        </MapGL>
      </div>
    )
  }
}

export default Demo
