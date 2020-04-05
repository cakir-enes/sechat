
export const remove = (arr, i) => [...arr.slice(0, i), ...arr.slice(i+1)]

export const replace = (arr, i, newVal) => [...arr.slice(0, i), newVal,...arr.slice(i+1)]