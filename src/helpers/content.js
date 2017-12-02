import isEqual from 'lodash/isEqual'

export const has = thing => !!((Array.isArray(thing) && thing.length) || Object.keys(thing).length)

export const getRoot = data =>
  Object.keys(data)
    .filter(key => !data[key].parent)
    .reduce((out, key) => ((out[key] = data[key]), out), {})

export const checkOpen = (selection, path) => {
  const part = selection.slice(0, path.length)
  return isEqual(part, path)
}
