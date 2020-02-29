import $ from 'jquery'
import moment from 'moment'
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