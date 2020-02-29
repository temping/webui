import $ from 'jquery'
import moment from 'moment'

export default function DatePicker(selector, option){
    const element = $(selector)
    return {
        element,
        name:"datepicker",
        time:moment().format("lll")
    }
} 