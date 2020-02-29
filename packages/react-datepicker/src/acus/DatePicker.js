import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'sizzle'
import dayjs from 'dayjs'

export default function DatePicker(selector, option) {
  const [el] = $(selector)
  class DatePickerRoot extends React.Component {
    constructor (props){
      super(props)
      this.state = {
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
            { state.focusCalendar === "date" && <DatePickerDateCalendar state={rootProps}/>}
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

function DatePickerDateCalendar (props) {
  const { state } = props
  const { focusYear, focusMonth, patchState } = state

  return (
    <div>
      <div>
        <button onClick={()=>patchState({ focusMonth: focusMonth-1 })}>&lt;</button>
        <span>{focusYear}년 {focusMonth}월</span>
        <button onClick={()=>patchState({ focusMonth: focusMonth+1 })}>&gt;</button>
      </div>
      <div>
        <DatePickerDaysTable />
      </div>
    </div>
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