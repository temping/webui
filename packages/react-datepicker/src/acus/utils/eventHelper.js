import { isPlainObject, asArray, isText } from './functions'

// on emit 스타일 이벤트 헬퍼
class EventHelperClass {
  listeners = {}

  constructor(events) {
    if (isPlainObject(events)) {
      for (const key in events) {
        this.on(key, key[events])
      }
    }
  }
  clone() {
    return new EventHelperClass(this.listeners)
  }
  on(key, eventFns) {
    const { listeners } = this
    asArray(eventFns).forEach(fn => {
      if (typeof fn === 'function') {
        if (!listeners[key]) listeners[key] = []
        listeners[key] = [...listeners[key], fn]
      } else {
        throw new Error('Event listener는 반드시 function 이여야 합니다.', key, eventFns)
      }
    })
    return this
  }
  off(key, eventFns) {
    const { listeners } = this
    asArray(eventFns).forEach(fn => {
      if (typeof fn === 'function') {
        if (!listeners[key]) return
        listeners[key] = listeners[key].filter(event => event !== fn)
      } else {
        throw new Error('Event listener는 반드시 function 이여야 합니다.', key, eventFns)
      }
    })
    return this
  }
  once(key, eventFns) {
    const self = this
    const wrapFns = asArray(eventFns)
      .map(fn => {
        if (typeof fn !== 'function') {
          return undefined
        }
        return function wrapFn() {
          fn()
          self.off(key, fn)
        }
      })
      .filter(Boolean)
    self.on(key, wrapFns)
    return self
  }
  emit(key, ...values) {
    const { listeners } = this
    const result = asArray(listeners[key]).map(fn => fn(...values))
    return result
  }
  trigger(key, values) {
    const { listeners } = this
    const parameters = asArray(values)
    const result = asArray(listeners[key]).map(fn => fn(...parameters))
    return result
  }
  getListeners(key) {
    if (!isText(key)) {
      return []
    }
    return asArray(this.listeners[key]).slice(0)
  }
  offEvents(key) {
    const { listeners } = this
    if (typeof key === 'string' && listeners[key]) {
      listeners[key] = []
    }
  }
  cleanListeners() {
    const { listeners } = this
    const cleanedListeners = {}
    for (const key in listeners) {
      cleanedListeners[key] = []
    }
    this.listeners = cleanedListeners
    return this
  }
  destroy() {
    this.listeners = null
    return null
  }
}

const eventHelper = (...params) => new EventHelperClass(...params)

eventHelper.EventHelper = EventHelperClass

export default eventHelper
