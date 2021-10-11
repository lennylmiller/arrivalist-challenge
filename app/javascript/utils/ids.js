let lastId = 0

// this can be useful when mapping a list of objects
// to react elements and the items do not contain a
// good key
export const newId = (prefix = 'id') => {
  lastId++
  return `${prefix}${lastId}`
}
