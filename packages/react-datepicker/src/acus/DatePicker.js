import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'sizzle'
import dayjs from 'dayjs'
import { hasPrevValue, findPrevValue, partition, unpartition } from './utils/functions';
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

function DatePickerInput (){
  return (
    <input type="text" />
  )
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
          <DatePickerMonthsTable />
        )}
        { focusCalendar === 'date' && (
          <DatePickerDaysTable />
        )}
      </div>
    </div>
  )
}

function DatePickerMonthsTable (props){
  return (
    <table>
      <tbody>
        <tr>
          <td>1월</td>
          <td>2월</td>
          <td>3월</td>
          <td>4월</td>
        </tr>
      </tbody>
    </table>
  )
}

function DatePickerDaysTable (props){
  return (
    <table>
      <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  )
}