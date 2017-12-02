import React, { Component } from 'react'
import styled from 'styled-components'

import Tabs from 'components/Tabs'
import Switch from 'components/Switch'

const Container = styled.div`
  display: flex;
  height: 2.5rem;
  flex-direction: column;
  border-bottom: 1px solid ${p => p.theme.border.light01};

  > div {
    display: flex;
    flex-grow: 1;
    > *:last-child {
      margin-left: auto;
    }
  }

  &:after {
    content: '';
    border-bottom: 1px solid ${p => p.theme.black};
  }
`

class Header extends Component {
  render() {
    return (
      <Container>
        <div>
          <Tabs />
          <Switch />
        </div>
      </Container>
    )
  }
}

export default Header
