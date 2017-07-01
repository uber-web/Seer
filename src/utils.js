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

/**
 * Transform a timestamp into a readable time expressed in H:M:S
 */
export const humanTime = timestamp => {
  const d = new Date(timestamp)
  const h = d.getHours()
  const m = d.getMinutes()
  const s = d.getSeconds()
  return `${h}:${m}:${s}`
}

/**
 * Find the (potentially) nested path of an item in a specific dataset
 * and return said array
 */
export const findPath = (data, itemKey, path = []) => (data[itemKey].parent)
  ? findPath(data, data[itemKey].parent, [itemKey, ...path])
  : [itemKey, ...path]

/**
 * Custom renderer for the json tree, overriding array display to show a preview
 * for arrays of number containing less than 5 elements (eg RGBA, vertexes)
 */
export const getItemString = (type, data, itemType, itemString) => {
  if (Array.isArray(data) && data.length <= 4 && !isNaN(data[0])) {
    return (<span>{`[${data.map(d => isNaN(d) ? d : d.toFixed(1)).join(', ')}]`}</span>)
  }
  return (<span>{itemType} {itemString}</span>)
}
