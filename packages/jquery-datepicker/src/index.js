import $ from 'jquery'
import moment from 'moment'
import { partition } from './utils'

function test01() {
    var array = []
    var reverseArray = []

    for ( var i = 0, l= 100; i<l; i++ ) {
        array.push(i+1)
        reverseArray.unshift(i+1)
    }
    // console.log(i, array, reverseArray, array.reverse())
}
test01();

$.fn.extend({
    datedatepicker: function(options){
        var container = this.eq(0);
        console.log({ container, options })
        var year = options.year || moment().year();
        var month = options.month || (moment().month() + 1);
        var viewMode = options.viewMode || 'date';

        // 수정 값을 받아서 상태 수정 (현재 미구현)
        // 수정된 값을 올바르게 보정
        function patchState (){
            if (month > 12) {
                month = 1;
                year += 1
            } else if (month < 1) {
                month = 12;
                year -= 1
            }


        }

        function render (){
            var titleText = (function(){
                switch(viewMode){
                    // case 'hour' :
                    //     return moment(year+"-"+month+"-"+date,"Y-M-D").format("YYYY년 MM월 DD일")
                    case "month":
                        return moment(year,"Y").format("YYYY년")
                    case "date":
                        default:
                        return moment(year+"-"+month,"Y-M").format("YYYY년 MM월")
                }
            })()
            $(".title").html(titleText)

            var currentMonth = moment(year+"-"+month,"Y-M");
            var firstDate = 1;
            var lastDate = currentMonth.clone().endOf("month").date();

            console.log({ currentMonth, lastDate })
            
            
            // 1일 마지막 날까지 구함
            var dates = []
            for(var i=firstDate; i<=lastDate; i++) {
                var current = currentMonth.clone().date(i)
                dates.push({
                    day: current.day(),
                    date: current.date(),
                    format: current.format("YYYY/MM/DD")
                });
            }

            // 7일씩 나눔
            var partitionDate = partition(dates, 7)
            
            console.log({
                dates,
                partitionDate
            })

            // tr 엘리먼트
            var trs = partitionDate.map(function(trData){
                var tr = $("<tr/>")

                trData.forEach(function (current){
                    if(!current){
                        current = {}
                    }
                    $("<td/>")
                    .text(current.date)
                    .attr("data-date", current.format)
                    .appendTo(tr)
                })
                
                return tr
            })

            //trs 를 tbody에 넣음
            $('.date_contents tbody').empty().append(trs)
        }

        $('.prev').on('click',  function(){
            if(viewMode === 'date'){
                month = month - 1    
            } else if(viewMode === 'month'){
                year = year - 1
            }
            patchState()
            render()
        });

        $('.next').on('click',  function(){
            if(viewMode === 'date'){
                month = month + 1;
            } else if(viewMode === 'month'){
                year = year + 1
            }
            patchState()
            render()
        });

        render()
    }
})

$('#datepicker').datedatepicker({
    // viewMode: 'month',
});