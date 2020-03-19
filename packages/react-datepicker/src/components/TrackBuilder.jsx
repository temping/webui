import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'

const TrackBuilder = props => {
  const { 
    model, 
    range,
    define = {},
    style = {},
    onInput, 
  } = props
  
  const trackDefine = useMemo(()=>{
    return {
      widthOfElement:"width",
      lengthOfElement:"height",
      trimModel: ()=>{
        
      },
      ...define
    }
  }, [define])

  const rootStyle = useMemo(() => {
    const { width, height, ...styleProps } = style
    return {
      ...styleProps,
      width: typeof width === 'number' ? width : 0,
      height: typeof height === 'number' ? height : 0,
    }
  }, [style, direction])

  const spotValue = useMemo(() => {
    const reciveModel = asArray(model)
    const spotPosition = isNumber(reciveModel[0]) ? reciveModel[0] : 0
    const spotSize = isNumber(reciveModel[1]) ? reciveModel[1] : 0
    return [spotPosition, spotSize]
  }, [model])

  if (!range) {
    throw new Error('ScrollTrack:: range must be defined')
  }

  if (!Array.isArray(range) || !isNumber(range[0]) || !isNumber(range[1])) {
    console.errer('Error type range', range)
    throw new Error(`ScrollTrack:: range type has worng. must be [:number, :number]`)
  }

  const rootElementRef = useRef()
  const trackElementRef = useRef()
  const thumbElementRef = useRef()

  const [scrolling, setScrolling] = useState(false)
  const [canScrollBackword, setCanScrollBackword] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(false)


}