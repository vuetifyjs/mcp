export function deepset (obj: Record<string, any>, path: string | string[], value: any) {
  if (typeof path === 'string') {
    path = path.split('.')
  }
  let i = 0
  for (; i < path.length - 1; i++) {
    if (typeof obj[path[i]] !== 'object' || obj[path[i]] === null) {
      obj[path[i]] = {}
    }
    obj = obj[path[i]]
  }
  obj[path[i]] = value
  return obj
}
