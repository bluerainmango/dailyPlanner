$('document').ready(function(){

    var state = {
        startHour : null,
        currentHour: null,
        formatedTime: null,
    }

function timeSensor(){

    setInterval(()=>{

        var momentObj = moment();

        // Time data update
        state.currentHour = momentObj.hour();
        state.formatedTime = momentObj.format('ddd MMM Do YYYY, h:mm A');

        // Render to DOM
        $('#currentTime').text(state.formatedTime);

        // Sense hour change and renew field's bg color accordingly
        if(state.startHour !== state.currentHour){
            colorField();
        }
    },500)
    
}  

function colorField(){

    $('.hour').each(function(){
       
        var hourNum = $(this).attr('data-hour'); // 9 - 17
        var hourToCompare = moment().hour(hourNum);

        // if this moment's hour === field's hour
        if(moment().isSame(hourToCompare, 'hour')){
            console.log(hourNum, 'same')
            $(this).next().addClass('current');
        }
        // if this moment's hour is after field's hour
        else if(moment().isAfter(hourToCompare, 'hour')){
            console.log(hourNum, 'past');
            $(this).next().addClass('past');
        }

    })
}

$('.btn').click(function(e){
    var hourForRecord = $(this).siblings('.hour').attr('data-hour'); // 10
    var dataForRecord = $(this).prev().val();
    console.log(hourForRecord, dataForRecord);
    
    localStorage.setItem(hourForRecord,dataForRecord);

})
function init(){
    FromLocalStorage();
    state.startHour = moment().hour();
    timeSensor();
    colorField();
}

function FromLocalStorage(){
    for(var i=9; i<18; i++){
        var savedText = localStorage.getItem(JSON.stringify(i))
        $(`[data-hour=${i}]`).siblings('textarea').val(savedText);
    }
}

init();




})