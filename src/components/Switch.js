import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { sendMessage } from 'bridge'
import { toggleActive } from 'actions/ui'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0.5rem;
  background-color: rgba(black, 0.5);

  > label {
    font-size: 11px;
    cursor: pointer;
    margin-right: 0.5rem;
  }
`

const Toggle = styled.div`
  width: 29px;
  position: relative;
  user-select: none;

  > input {
    display: none;

    &:checked + .label .switch {
      right: 0px;
    }
  }

  .label {
    display: block;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid #56575c;
  }

  .switch {
    position: absolute;
    top: 0;
    bottom: 0;
    display: block;
    width: 11px;
    margin: 3px;

    transition: all 150ms ease-in;
    background-color: ${p => (p.isActive ? p.theme.primary : p.theme.border.light)};
  }

  .inner {
    display: block;
    width: 200%;
    margin-left: -100%;

    &:before,
    &:after {
      display: block;
      float: left;
      width: 50%;
      height: 13px;
      padding: 0;
      box-sizing: border-box;
    }

    &:before,
    &:after {
      content: '';
    }
  }
`

@connect(({ ui: { active } }) => ({ active }), {
  toggleActive,
})
class Switch extends Component {
  componentDidMount() {
    const { active } = this.props
    sendMessage('switchCapture', { value: active })
  }

  componentWillUpdate(nextProps) {
    if (nextProps.active !== this.props.active) {
      sendMessage('switchCapture', { value: nextProps.active })
    }
  }

  switch = () => {
    const { toggleActive } = this.props
    toggleActive()
  }

  render() {
    const { active } = this.props

    return (
      <Container>
        <label htmlFor="live">{'Live update'}</label>
        <Toggle isActive={active}>
          <input type="checkbox" checked={active} onChange={this.switch} id="live" />
          <label className="label" htmlFor="live">
            <span className="inner" />
            <span className="switch" />
          </label>
        </Toggle>
      </Container>
    )
  }
}

export default Switch
