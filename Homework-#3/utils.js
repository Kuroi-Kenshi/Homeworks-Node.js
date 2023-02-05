export const getDepthSymbol = (type, depth) => {
  if (type === 'parent') return '├──';
  return '|' + ' '.repeat(depth) + '└──'
}

export const showObject = (object, depth = 0) => {
  for (const itemKey in object) {
    const item = object[itemKey]

    if (typeof item === 'number') {
      if (depth) console.log(getDepthSymbol('', depth), item);
      if (!depth) console.log(getDepthSymbol('parent', depth), item);
    }

    if (Array.isArray(item)) {
      item.forEach((element) => showObject(element, depth + 1))
    }
  }
}
