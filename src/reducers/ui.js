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

const initialState = {
  active: true,
  selectedTab: null,
  selectedItem: [],
}

const selectFirstTab = (state, key) =>
  state.selectedTab
    ? state
    : {
        ...state,
        selectedTab: key,
      }

export default handleActions(
  {
    TOGGLE_ACTIVE: state => ({ ...state, active: !state.active }),

    LIST: (state, { payload: { key } }) => selectFirstTab(state, key),
    LIST_ITEM: (state, { payload: { key } }) => selectFirstTab(state, key),
    UPDATE_ITEM: (state, { payload: { key } }) => selectFirstTab(state, key),
    MULTI_UPDATE_ITEM: (state, { payload: { key } }) => selectFirstTab(state, key),

    SELECT_TAB: (state, { payload: key }) => ({
      ...state,
      selectedTab: key,
      selectedItem: [],
    }),

    SELECT_ITEM: (state, { payload: selectedItem }) => ({
      ...state,
      selectedItem,
    }),

    GOTO: (state, { payload }) => ({ ...state, ...payload }),

    RESET: state => ({ ...initialState, active: state.active }),
  },
  initialState,
)
