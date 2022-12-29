let depth = 0;

const getDepthSymbol = (type) => {
  if (type === 'parent') return '├──';
  return '|' + ' '.repeat(depth) + '└──'
}

export const showObject = (object) => {
  for (const itemKey in object) {
    const item = object[itemKey]

    if (typeof item === 'number') {
      if (depth) console.log(getDepthSymbol(), item);
      if (!depth) console.log(getDepthSymbol('parent'), item);
    }

    if (Array.isArray(item)) {
      ++depth;
      item.forEach(showObject)

      if (!('items' in item)) depth = depth - 1;
    }
  }
}