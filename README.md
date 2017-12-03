<p align="right">
  <a href="https://travis-ci.org/uber-web/Seer">
    <img src="https://img.shields.io/travis/uber-web/Seer.svg?style=flat-square">
  </a>
  <a href="https://coveralls.io/github/uber-web/Seer">
    <img src="https://img.shields.io/coveralls/uber-web/Seer.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/seer">
    <img src="https://img.shields.io/npm/v/seer.svg?style=flat-square">
  </a>
  <a href="https://chrome.google.com/webstore/detail/seer/eogckabefmgphfgngjdmmlfbddmonfdh">
    <img src="https://img.shields.io/chrome-web-store/v/eogckabefmgphfgngjdmmlfbddmonfdh.svg?style=flat-square">
  </a>
  <a href="https://github.com/SIGSEV/minus">
    <img src="https://img.shields.io/badge/scaffold-minus-blue.svg?style=flat-square">
  </a>
</p>

<p align="center">
  <img src="https://cdn.pbrd.co/images/2mmml1lec.png" height=100 />
</p>

<p align="center">A customizable devtool solution</p>

<img src="https://cdn.pbrd.co/images/GWt0Bpj.png" />

### Introduction

After the introduction of the completely new debugging/logging experience brought by Redux and its
extension, we thought it would be a good idea to provide this to a greater audience of the Javascript
ecosystem. The Seer API give library creators simple methods they need to implement so that developers
using both these libraries and the extension will be able to easily debug state and even things
like editing capabilities, as showcased above.

Although pretty basic for now and only working with uber framemorks [deck.gl](https://github.com/uber/deck.gl)
and [luma.gl](https://github.com/uber/luma.gl), we intend to extend it to allow for more possibilities and create more
interactions in the future.

### API

Checkout the [api directory](./api) to see the api usage allowing you to interact with the extension.

### Install

The extension can be easily downloaded from the Chrome webstore. If you desire to build it manually,
you simply need to `npm run build` after having installed the dependencies.

### Contributing

If you desire to contribute to the development efforts of this project, the following processes
will help you to debug and see your changes.

    npm start

This command will spawn a webpack server that will serve the extension along with the test website.

    npm run standalone

After a build and the uninstall of the unpacked extension, runs the demo without the app, so you can
test direct interaction from the devtool panel.

Note that for the mapbox tiles to load, you'll need to have a valid `MAPBOX_TOKEN` environment variable.

<sub>
Inspired by the awesome <a href="https://github.com/gaearon/redux-devtools">redux-devtools</a>.
Based on <a href="https://github.com/SIGSEV/minus">minus</a> & <a href="https://github.com/SIGSEV/Bridge">Bridge</a>.
</sub>
