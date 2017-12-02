import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import JSONTree from 'react-json-tree-zavatta'
import LinkIcon from 'react-icons/lib/md/link'
import RightIcon from 'react-icons/lib/fa/angle-right'
import DownIcon from 'react-icons/lib/fa/angle-down'

import { sendMessage } from 'bridge'
import { humanTime, findPath, getItemString } from 'utils'
import { goto, selectItem } from 'actions/ui'
import { has, getRoot, checkOpen } from 'helpers/content'
import Help from 'components/Help'

const Container = styled.div`
  flex-grow: 1;

  > * + * {
    border-top: 3px solid ${p => p.theme.base00};
    &:before {
      content: '';
      border-top: 1px solid ${p => p.theme.border.light01};
    }
  }
`

const Item = styled.div`
  padding: 1rem;

  > div {
    padding-left: 1rem;
  }

  > * + * {
    margin-top 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(white, 0.1);
  }
`

const Badge = styled.span`
  line-height: 15px;
  font-size: 12px;
  font-weight: bold;
  color: ${p => p.theme.color.inactive};
  background-color: ${p => p.theme.base00};

  padding: 0.3rem 0.5rem;
  display: flex;
  justify-content: center;
`

const ListItem = styled.div`
  background-color: ${p => p.theme.base01};
  display: flex;
  flex-direction: column;
`

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  height: 3.5rem;

  h3 {
    display: flex;
    align-items: center;
    margin-right: auto;
  }

  > span + span {
    margin-left: 0.5rem;
  }
`

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
    if (!data) {
      return
    }
    const path = findPath(data, itemKey)
    goto({ selectedItem: path, selectedTab: tab })
  }

  renderItem = (itemKey, item, path) => {
    const { objects, actions, images, logs, links } = item

    return (
      <Item key={itemKey}>
        {has(actions) && (
          <div className="category">
            {Object.keys(actions).map(key => {
              const { type, ...actionProps } = actions[key]
              return type === 'button' ? (
                <button {...actionProps} className="action action-btn" key={key}>
                  {key}
                </button>
              ) : (
                <div className="action fac" style={{ padding: '0.5rem' }} key={key}>
                  <span style={{ marginRight: '0.5rem' }}>{key}</span>
                  <input {...actionProps} type={type} key={key} />
                </div>
              )
            })}
          </div>
        )}

        {has(objects) && (
          <div className="category">
            {Object.keys(objects).map(key => (
              <div key={key}>
                <div>{key}</div>
                <div className="json-root">
                  <JSONTree
                    getItemString={getItemString}
                    onChange={v => this.updateValue(itemKey, key, v)}
                    data={objects[key]}
                    hideRoot
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {has(images) && (
          <div className="category">
            {Object.keys(images).map(key => (
              <div key={key}>
                <div style={{ marginBottom: '0.5rem' }}>{key}</div>
                <img src={images[key]} />
              </div>
            ))}
          </div>
        )}

        {has(logs) && (
          <div className="category">
            {logs.map(({ time, msg }, i) => (
              <div className="log" key={`${time}-${i}`}>
                <span className="log-time">
                  {humanTime(time)}
                  {': '}
                </span>
                <span>{msg}</span>
              </div>
            ))}
          </div>
        )}

        {has(links) && (
          <div className="category">
            {links.map(link => (
              <a onClick={() => this.goto(link)} style={{ marginRight: '1rem' }} key={link}>
                <LinkIcon style={{ marginRight: '0.2rem' }} />
                {link}
              </a>
            ))}
          </div>
        )}

        {this.renderChildren(itemKey, path)}
      </Item>
    )
  }

  renderChildren = (parentKey, path) => {
    const { data } = this.props
    const children = Object.keys(data).reduce((out, key) => {
      const el = data[key]
      if (el.parent === parentKey) {
        out[key] = el
      }
      return out
    }, {})

    if (!Object.keys(children).length) {
      return null
    }

    return <div style={{ marginTop: '1rem' }}>{this.renderList(children, path)}</div>
  }

  renderList = (list, dadPath = []) => {
    const { selectedItem, selectItem } = this.props

    return Object.keys(list)
      .sort((keyA, keyB) => keyA.localeCompare(keyB))
      .map(key => {
        const path = [...dadPath, key]
        const isOpen = checkOpen(selectedItem, path)
        const item = list[key]

        return (
          <ListItem isOpen={isOpen} key={key}>
            <ItemMeta onClick={() => (isOpen ? selectItem(dadPath) : selectItem(path))}>
              <h3>
                <span style={{ fontSize: 8, marginRight: 10, width: 10 }}>
                  {isOpen ? <DownIcon size={10} /> : <RightIcon size={10} />}
                </span>
                <span>{key}</span>
              </h3>

              {item.badges.map((badge, i) => (
                <Badge
                  aria-label={badge.hint ? badge.hint : ''}
                  className="hint--top hint--no-animate"
                  key={i}
                >
                  {badge.text || badge}
                </Badge>
              ))}
            </ItemMeta>

            {isOpen && this.renderItem(key, item, path)}
          </ListItem>
        )
      })
  }

  render() {
    const { selectedTab, data } = this.props

    return (
      <Container>
        {!selectedTab && <Help />}
        {data && this.renderList(getRoot(data))}
      </Container>
    )
  }
}

export default Content
