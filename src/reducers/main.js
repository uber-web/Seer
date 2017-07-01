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

import { handleActions } from 'redux-actions'
import immutable from 'object-path-immutable'

const initialState = {}

export const defaultItem = {
  badges: [],
  objects: {},
  lists: {},
  actions: {},
  images: {},
  logs: [],
  links: [],
  parent: null,
}

const initItem = (state, key, itemKey) => !state[key] || !state[key][itemKey]
  ? immutable.set(state, [key, itemKey], defaultItem)
  : state

export default handleActions({

  LIST: (state, { payload: { key, data } }) =>
    immutable.set(state, [key], data),

  LIST_ITEM: (state, { payload: { key, itemKey, data } }) =>
    immutable.set(state, [key, itemKey], {
      ...defaultItem,
      ...data,
    }),

  UPDATE_ITEM: (state, { payload: { key, itemKey, path, data } }) =>
    immutable.set(initItem(state, key, itemKey), [key, itemKey, ...path.split('.')], data),

  MULTI_UPDATE_ITEM: (state, { payload: { key, itemKey, array } }) =>
    array.reduce((out, { path, data }) =>
      immutable.set(out, [key, itemKey, ...path.split('.')], data), initItem(state, key, itemKey)),

  DELETE_ITEM: (state, { payload: { key, itemKey } }) =>
    immutable.del(state, [key, itemKey]),

  ADD_LOG: (state, { payload: { key, itemKey, msg } }) => {
    const int = immutable.push(initItem(state, key, itemKey), [key, itemKey, 'logs'], { time: Date.now(), msg })
    const len = int[key][itemKey].logs.length
    if (len < 20) { return int }
    return immutable.del(int, [key, itemKey, 'logs', 0])
  },

  RESET: () => initialState,

}, initialState)
