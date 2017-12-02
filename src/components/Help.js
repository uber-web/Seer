import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 1rem;

  > div:first-child {
    display: flex;
    justify-content: center;
  }

  .code {
    font-family: monospace;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 1rem;
    margin: 0.5rem 0;
  }

  > div + div {
    margin-top: 0.5rem;
  }
`

export default () => (
  <Container>
    <div>
      <img src="https://cdn.pbrd.co/images/eJImDurl.png" height="100" />
    </div>

    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      {"No data has been yet received. To hook into Seer, you'll have follow these steps:"}
    </div>

    <div>
      {'1) Install the package as a dependency'}
      <pre className="code">{'yarn add seer'}</pre>
    </div>
    <div>
      {'2) Use one of the provided methods to send messages'}
      <pre className="code">
        {"import seer from 'seer'\n\n...\n\nseer.listItem('test-tab', 'yolo', {})"}
      </pre>
    </div>
    <div>
      {'3) Use listenFor if you want to receive messages'}
      <pre className="code">{"seer.listenFor('test-tab', msg => console.log(msg))"}</pre>
    </div>
  </Container>
)
