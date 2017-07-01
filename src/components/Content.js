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
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import JSONTree from 'react-json-tree-zavatta'
import LinkIcon from 'react-icons/lib/md/link'
import isEqual from 'lodash/isEqual'

import { sendMessage } from 'bridge'
import { humanTime, findPath, getItemString } from 'utils'
import { goto, selectItem } from 'actions/ui'
import Help from 'components/Help'

const has = thing => !!((Array.isArray(thing) && thing.length) || Object.keys(thing).length)

const getRoot = data => Object.keys(data)
  .filter(key => !data[key].parent)
  .reduce((out, key) => (out[key] = data[key], out), {})

const checkOpen = (selection, path) => {
  const part = selection.slice(0, path.length)
  return isEqual(part, path)
}

export const mapStateToProps = ({ ui, main }) => {
  const { selectedTab, selectedItem } = ui
  const data = main[selectedTab]
  return { data, selectedTab, selectedItem }
}

@connect(mapStateToProps, {
  selectItem,
  goto,
})
class Content extends Component {

  static contextTypes = { store: PropTypes.object }

  updateValue = (itemKey, mainKey, { keyPath, value }) => {
    const { selectedTab } = this.props

    sendMessage(selectedTab, {
      type: 'edit',
      valuePath: [mainKey, ...keyPath.map((p, i, array) => array[array.length - i - 1])],
      itemKey,
      value,
    })
  }

  goto = link => {
    const { goto } = this.props
    const { main } = this.context.store.getState()
    const [tab, itemKey] = link.split(':')
    const data = main[tab]
    // TODO maybe error toast?
    if (!data) { return }
    const path = findPath(data, itemKey)
    goto({ selectedItem: path, selectedTab: tab })
  }

  renderItem = (itemKey, item, path) => {
    const { objects, actions, images, logs, links } = item

    return (
      <div key={itemKey}>

        {has(actions) && (
          <div className='category'>
            {Object.keys(actions).map(key => {
              const { type, ...actionProps } = actions[key]
              return (type === 'button') ? (
                <button {...actionProps} className='action action-btn' key={key}>{key}</button>
              ) : (
                <div className='action fac' style={{ padding: '0.5rem' }} key={key}>
                  <span style={{ marginRight: '0.5rem' }}>{key}</span>
                  <input
                    {...actionProps}
                    type={type}
                    key={key} />
                </div>
              )
            })}
          </div>
        )}

        {has(objects) && (
          <div className='category'>
            {Object.keys(objects).map(key => (
              <div key={key}>
                <div>{key}</div>
                <div className='json-root'>
                  <JSONTree
                    getItemString={getItemString}
                    onChange={v => this.updateValue(itemKey, key, v)}
                    data={objects[key]}
                    hideRoot />
                </div>
              </div>
            ))}
          </div>
        )}

        {has(images) && (
          <div className='category'>
            {Object.keys(images).map(key => (
              <div key={key}>
                <div style={{ marginBottom: '0.5rem' }}>{key}</div>
                <img src={images[key]} />
              </div>
            ))}
          </div>
        )}

        {has(logs) && (
          <div className='category'>
            {logs.map(({ time, msg }, i) => (
              <div className='log' key={`${time}-${i}`}>
                <span className='log-time'>{humanTime(time)}{': '}</span>
                <span>{msg}</span>
              </div>
            ))}
          </div>
        )}

        {has(links) && (
          <div className='category'>
            {links.map(link => (
              <a
                onClick={() => this.goto(link)}
                style={{ marginRight: '1rem' }}
                key={link}>
                <LinkIcon style={{ marginRight: '0.2rem' }} />
                {link}
              </a>
            ))}
          </div>
        )}

        {this.renderChildren(itemKey, path)}

      </div>
    )
  }

  renderChildren = (parentKey, path) => {
    const { data } = this.props
    const children = Object.keys(data).reduce((out, key) => {
      const el = data[key]
      if (el.parent === parentKey) { out[key] = el }
      return out
    }, {})

    return (
      <div style={{ marginTop: '1rem' }}>
        {this.renderList(children, path)}
      </div>
    )
  }

  renderList = (list, dadPath = []) => {
    const { selectedItem, selectItem } = this.props

    return Object.keys(list)
      .sort((keyA, keyB) => keyA.localeCompare(keyB)).map(key => {
        const path = [...dadPath, key]
        const isOpen = checkOpen(selectedItem, path)
        const item = list[key]
        return (
          <div
            className={`list-item ${isOpen ? 'opened' : 'closed'}`}
            key={key}>

            <div
              className='fac pointer'
              onClick={() => isOpen ? selectItem(dadPath) : selectItem(path)}>

              <h3 className='item-title fac fg'>{key}</h3>

              {item.badges.map((badge, i) => (
                <span
                  aria-label={badge.hint ? badge.hint : ''}
                  className='hint--top hint--no-animate item-badge'
                  key={i}>
                  {badge.text || badge}
                </span>
              ))}

            </div>

            {isOpen && this.renderItem(key, item, path)}

          </div>
        )
      })
  }

  render () {

    const { selectedTab, data } = this.props

    return (
      <div className='Content fg'>
        {!selectedTab && <Help />}
        {data && this.renderList(getRoot(data))}
      </div>
    )
  }

}

export default Content
