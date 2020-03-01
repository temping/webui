import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'sizzle'
import dayjs from 'dayjs'
import { hasPrevValue, findPrevValue, partition } from './utils';
import { CALENDAR_TYPE_HELPER } from './DatePickerHelepr';

export default function DatePicker(selector, option) {
  const [el] = $(selector)

  class DatePickerRoot extends React.Component {
    constructor (props){
      super(props)
      this.state = {
        activeCalendars: ["month", "date", "hour"],
        focusCalendar: "date",
        focusYear:dayjs().year(),
        focusMonth:dayjs().month()+1,
        selected: null,
      }
    }
    patchState (patchProps){
      if(typeof patchProps !== 'object'){
        return
      }
      const { state } = this
      const updateState = {
        ...state,
        ...patchProps
      }
      const resolvedFocusDay = dayjs(`${updateState.focusYear}-${updateState.focusMonth}`)
      updateState.focusYear = resolvedFocusDay.year()
      updateState.focusMonth = resolvedFocusDay.month() + 1

      this.setState(updateState)
    }
    render () {
      const { props, state, patchState } = this
      const rootProps = { ...state, patchState:patchState.bind(this) }
      return (
        <>
          <pre>{JSON.stringify(state, 2, 2)}</pre>
          <DatePickerInput state={rootProps}/>
          <div className="root">
            <DatePickerDateCalendar state={rootProps}/>
          </div>
        </>
      );
    }
  }

  ReactDOM.render(<DatePickerRoot />, el);
}

function DatePickerInput (props){
  const { state: { selected } } = props
  if(selected instanceof Date){
    return <input type="text" value={dayjs(selected).format("YYYY-MM-DD")}/>
  } else {
    return <input type="text" value=""/>
  }
}

function DatePickerCalendarHeader (props){
  const { state } = props
  const { focusYear, focusMonth, activeCalendars, focusCalendar, patchState } = state

  // arrow left
  function handlePrev (){
    const { keyOfArrowValue } = CALENDAR_TYPE_HELPER[focusCalendar]
    patchState({ [keyOfArrowValue]: state[keyOfArrowValue]-1 })
  }

  // arrow right
  function handleNext (){
    const { keyOfArrowValue } = CALENDAR_TYPE_HELPER[focusCalendar]
    patchState({ [keyOfArrowValue]: state[keyOfArrowValue]+1 })
  }

  // upper calendar
  function handleUpperCalendar (){
    console.log("hasPrevValue(activeCalendars, focusCalendar)", hasPrevValue(activeCalendars, focusCalendar), { activeCalendars, focusCalendar })
    if(!hasPrevValue(activeCalendars, focusCalendar)){
      return
    }
    const upperCalendarType = findPrevValue(activeCalendars, focusCalendar)
    patchState({ focusCalendar: upperCalendarType })
  }

  const headerFocusDateLabel = (()=>{
    switch(focusCalendar){
      case "month":
        return `${focusYear}년`
      case "date":
        default:
          return `${focusYear}년 ${focusMonth}월`
    }
  })()

  return (
    <div>
      <button onClick={handlePrev}>&lt;</button>
      <span onClick={handleUpperCalendar}>{headerFocusDateLabel}</span>
      <button onClick={handleNext}>&gt;</button>
    </div>
  )
}

function DatePickerDateCalendar (props) {
  const { state: { focusCalendar } } = props
  return (
    <div>
      <DatePickerCalendarHeader {...props}/>
      <div>
        { focusCalendar === 'month' && (
          <DatePickerMonthsTable {...props}/>
        )}
        { focusCalendar === 'date' && (
          <DatePickerDaysTable {...props}/>
        )}
      </div>
    </div>
  )
}

function DatePickerMonthsTable (props){
  const { state: { patchState, focusMonth, focusCalendar } } = props
  const monthes = partition(Array.from({ length:12 }).map((d,index)=>({
    month: index + 1,
    label:`${index+1}월`
  })), 4)
  return (
    <table>
      <tbody>
        {monthes.map((cols, rowIndex)=>(
          <tr key={`date-row-${rowIndex}`}>
            {cols.map((col, colIndex)=>(
              <td 
                key={`date-row-${rowIndex}-${colIndex}`}
                onClick={()=>patchState({ focusMonth: col.month, focusCalendar:"date" })}
              >
                {col.label}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function DatePickerDaysTable (props){
  const { state: { patchState, focusYear, focusMonth } } = props
  const focusDay = dayjs(`${focusYear}-${focusMonth}`)

  const lastDate = focusDay.endOf("month").date()
  
  const focusDates = Array.from({ length:lastDate }).map((d,index)=>{
    const current = focusDay.date(index+1).startOf('date')
    return {
      label:current.date(),
      current
    }
  })

  const eachDates = partition(focusDates, 7)
  
  return (
    <table>
      <tbody>
        {eachDates.map((cols, rowIndex)=>(
          <tr key={`date-row-${rowIndex}`}>
            {cols.map((col, colIndex)=>(
              <td 
                key={`date-col-${rowIndex}-${colIndex}`}
                onClick={()=>{ patchState({ selected:col.current.toDate() }) }}
              >
                {col && col.label}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}