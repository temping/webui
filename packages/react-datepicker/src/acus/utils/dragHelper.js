/*
  predict(element)
  predict(element,{center:20});
  predict(element,{center:event});
*/

const getElementPosition = function(el) {
  let element = el

  if (!element) return null

  let xPosition = 0
  let yPosition = 0

  while (element && !element.documentElement) {
    xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft
    yPosition += element.offsetTop - element.scrollTop + element.clientTop
    element = element.offsetParent
  }

  return { x: xPosition, y: yPosition }
}

const getPointerPosition = function(e, root) {
  root = !root ? document.documentElement : root

  const pos = getElementPosition(root)

  if (!pos) return

  pos.x = (e.touches ? e.targetTouches[0].pageX : e.pageX) - pos.x
  pos.y = (e.touches ? e.targetTouches[0].pageY : e.pageY) - pos.y

  return pos
}

export const predict = function(container, option, root) {
  const element = container

  const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = element['innerWidth']
    ? {
        offsetTop: 0,
        offsetLeft: 0,
        offsetWidth: window.innerWidth,
        offsetHeight: window.innerHeight,
      }
    : element

  const result = {
    top: offsetTop,
    left: offsetLeft,
    width: offsetWidth,
    height: offsetHeight,
    right: offsetLeft + offsetWidth,
    bottom: offsetTop + offsetHeight,
    center: offsetLeft + offsetWidth / 2,
    middle: offsetTop + offsetHeight / 2,
  }

  if (typeof option === 'object') {
    //console.log("option,",option)
    const allProps = ['top', 'left', 'width', 'height', 'right', 'bottom', 'center', 'middle'].filter(key =>
      option.hasOwnProperty(key),
    )

    //event option
    allProps.forEach(key => {
      const optionOfKey = option[key]
      const pointerPosition = getPointerPosition(optionOfKey, root || element)
      if (!pointerPosition) return

      if (/left|width|right|center/.test(key)) {
        option[key] = pointerPosition['x']
      }

      if (/top|middle|bottom|height/.test(key)) {
        option[key] = pointerPosition['y']
      }
    })

    allProps.forEach(key => {
      if (typeof option[key] !== 'number') return

      const valueOfKey = result[key]
      let equalize

      switch (key) {
        case 'top':
        case 'middle':
          equalize = ['y', option[key] - valueOfKey]
          break
        case 'left':
        case 'center':
          equalize = ['x', option[key] - valueOfKey]
          break
        case 'width':
          equalize = ['width', option[key] - valueOfKey]
          break
        case 'height':
          equalize = ['height', option[key] - valueOfKey]
          break
        case 'right':
          break
        case 'bottom':
          break
        default:
          break
      }

      switch (equalize && equalize[0]) {
        case 'x':
          result['left'] += equalize[1]
          result['center'] += equalize[1]
          result['right'] += equalize[1]
          break
        case 'y':
          result['top'] += equalize[1]
          result['middle'] += equalize[1]
          result['bottom'] += equalize[1]
          break
        case 'width':
          result['width'] += equalize[1]
          result['right'] += equalize[1]
          result['center'] += result['right'] - result['left'] / 2
          break
        case 'height':
          result['height'] += equalize[1]
          result['bottom'] += equalize[1]
          result['middle'] += result['bottom'] - result['top'] / 2
          break
        default:
          break
      }
    })
  }

  return result
}

const DEVICE_TARGETS = {
  MOUSE: {
    TOUCH_DEVICE: false,
    START: 'mousedown',
    MOVE: 'mousemove',
    END: 'mouseup',
  },
  TOUCH: {
    START: 'touchstart',
    MOVE: 'touchmove',
    END: 'touchend',
  },
}
let DEVICE_EVENT = null

//
let dragRetainCount = 0

//
const bindDraggingAttribute = function() {
  if (dragRetainCount > 0) {
    document.body.setAttribute('dragging', '')
  } else {
    document.body.removeAttribute('dragging')
  }
}

//
const handleBlockDragMultiple = e => {
  dragRetainCount > 0 && e.preventDefault()
}
window.addEventListener('touchmove', handleBlockDragMultiple, { passive: false })

//드래그
let touchFixX
let touchFixY
const pointerParse = ({ clientX, clientY, touches }) => {
  if (touches) {
    if (!touches[0]) {
      return {
        x: touchFixX,
        y: touchFixY,
      }
    }

    const { clientX: touchClientX, clientY: touchClientY } = touches[0]
    touchFixX = touchClientX
    touchFixY = touchClientY

    return {
      x: touchClientX,
      y: touchClientY,
    }
  }
  return {
    x: clientX,
    y: clientY,
  }
}

export default function DragHelper(element, option) {
  let startFn
  let moveFn
  let endFn

  let dragParams = null
  let firstDrag = null
  let lastDrag = null

  const resetOptions = function() {
    const getOptions = typeof option === 'function' ? option({ element }) : option
    startFn = getOptions['start']
    moveFn = getOptions['move']
    endFn = getOptions['end']
  }

  const getCurrentPointerDrag = function(originalEvent) {
    const pointerDrag = pointerParse(originalEvent)

    //현재 이동한 거리
    pointerDrag.moveX = pointerDrag.x - lastDrag.x
    pointerDrag.moveY = pointerDrag.y - lastDrag.y

    //처음으로부터 변경된 거리
    pointerDrag.offsetX = pointerDrag.x - firstDrag.x
    pointerDrag.offsetY = pointerDrag.y - firstDrag.y

    //처음으로 부터 변경되어 엘리먼트 오프셋 크기
    pointerDrag.leftValue = dragParams.offset.left + pointerDrag.offsetX
    pointerDrag.topValue = dragParams.offset.top + pointerDrag.offsetY

    pointerDrag.left = pointerDrag.leftValue + 'px'
    pointerDrag.top = pointerDrag.topValue + pointerDrag.offsetY + 'px'

    return pointerDrag
  }

  const dragEnter = function(originalEvent) {
    //init
    resetOptions()

    //
    const elementOffset = predict(element)
    const pointerDrag = pointerParse(originalEvent)

    firstDrag = pointerDrag
    lastDrag = pointerDrag

    dragParams = { offset: elementOffset, pointer: undefined, event: originalEvent }
    dragParams.pointer = getCurrentPointerDrag(originalEvent)

    startFn && startFn(dragParams)

    DEVICE_EVENT = originalEvent.touches ? DEVICE_TARGETS.TOUCH : DEVICE_TARGETS.MOUSE

    document.addEventListener(DEVICE_EVENT.MOVE, dragMove)
    document.addEventListener(DEVICE_EVENT.END, dragExit)

    dragRetainCount += 1
    bindDraggingAttribute()
  }

  const dragMove = function(originalEvent) {
    const pointerDrag = pointerParse(originalEvent)

    if (!moveFn) {
      lastDrag = pointerDrag
      return
    } else {
      dragParams.pointer = getCurrentPointerDrag(originalEvent)
      dragParams.event = originalEvent
      moveFn(dragParams)
      lastDrag = pointerDrag
    }
  }

  const dragExit = function(originalEvent) {
    dragParams.pointer = getCurrentPointerDrag(originalEvent)
    dragParams.event = originalEvent
    endFn && endFn(dragParams)
    dragParams = undefined

    document.removeEventListener(DEVICE_EVENT.MOVE, dragMove)
    document.removeEventListener(DEVICE_EVENT.END, dragExit)

    dragRetainCount -= 1
    bindDraggingAttribute()
  }

  const handlePrevent = e => {
    e.preventDefault()
  }
  element.addEventListener('dragstart', handlePrevent)
  element.addEventListener(DEVICE_TARGETS.MOUSE.START, dragEnter)
  element.addEventListener(DEVICE_TARGETS.TOUCH.START, dragEnter)
  return {
    element,
    destroy() {
      window.removeEventListener('touchmove', handleBlockDragMultiple)
      element.removeEventListener('dragstart', handlePrevent)
      element.removeEventListener(DEVICE_TARGETS.MOUSE.START, dragEnter)
      element.removeEventListener(DEVICE_TARGETS.TOUCH.START, dragEnter)
    },
  }
}
