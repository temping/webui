// NaN 평가 함수 (it:any):boolean
export const isAbsoluteNaN = function(it) {
  // eslint-disable-next-line no-self-compare
  return it !== it && typeof it === 'number'
}

// Infinity number 평가 함수 (it:any):boolean
export const isInfinity = function(it) {
  return it === Number.POSITIVE_INFINITY || it === Number.NEGATIVE_INFINITY
}

// 순수 숫자 평가 함수 (it:any):boolean
export const isNumber = function(it) {
  return typeof it === 'number' && !isInfinity(it) && !isAbsoluteNaN(it)
}

// 숫자나 글자인지 평가하는 함수
export const isText = function(it) {
  return typeof it === 'string' || isNumber(it)
}

// null이나 undefined를 확인하기 위한 함수
export const isNone = function(data) {
  return isAbsoluteNaN(data) || data === undefined || data === null
}

// 순수 Array를 확인하기 위한 함수
export const isArray = function(data) {
  return Array.isArray(data) || data instanceof Array
}

// 순수 Object를 확인하기 위한 함수
export const isPlainObject = function(data) {
  return typeof data === 'object' && Boolean(data) && data.constructor === Object
}

// array이면 그대로 리턴 아니면 Array로 변경하여 리턴함
export const asArray = function(data, defaultArray=[]) {
  if (isArray(data)) {
    return data
  }
  if (isNone(data)) {
    return isArray(defaultArray) ? [...defaultArray] : isNone(defaultArray) ? [] : [defaultArray]
  }
  if (typeof data === 'object' && typeof data.toArray === 'function') {
    return data.toArray()
  }
  return [data]
}

export const toArray = (data)=>([...asArray(data)])

export const unpartition = (data)=>{
  const result = []
  asArray(data).forEach(innerData=>asArray(innerData).forEach((innerDatum)=>{ result.push(innerDatum) }))
  return result
}

export const partition = (data, want)=>{
  const original = toArray(data)
  if(typeof want === "number" && want > 0){
    const result = []
    const rowsCount = Math.ceil(original.length / want)
    for(let rowIndex=0;rowIndex<rowsCount;rowIndex++){
      result.push([])
      const rowData = result[rowIndex]
      for(let columnIndex=0;columnIndex<want;columnIndex++){
        const targetIndex = (rowIndex * want) + columnIndex
        rowData.push(original[targetIndex])
      }
    }
    return result
  }
  return []
}

export const toggleValue = (toggleValues, currentValue, step = 1) => {
  return (
    (toggleValues = asArray(toggleValues)) &&
    toggleValues[(toggleValues.findIndex(val => val === currentValue) + step) % toggleValues.length]
  )
}

export const findNextValue = (toggleValues, currentValue, step = 1) => {
  const values = asArray(toggleValues)
  const currentIndex = values.findIndex(val=>(val===currentValue))
  if(currentIndex === -1) return undefined
  return toggleValues[currentIndex + step]
}

export const findPrevValue = (toggleValues, currentValue, step = 1) => findNextValue( toggleValues, currentValue, step * -1 )

export const hasNextValue = (toggleValues, currentValue, step = 1) => {
  const values = asArray(toggleValues)
  const currentIndex = values.findIndex(val=>(val===currentValue))
  const findValue = currentIndex + step
  return (findValue === -1 || findValue >= values.length) ? false : true
}

export const hasPrevValue = (toggleValues, currentValue, step = 1) => hasNextValue(toggleValues, currentValue, -1 * step)