$('document').ready(function(){

    var state = {
        startHour : null, // variable to detect hour change
        currentHour: null,
        formatedTime: null,
        setBeginingHour: 9, // set first time slot(default: 9(9am))
        setEndingHour: 17 // set last time slot(default: 17(5pm))
    }

// Render time slots HTML
function renderTimeSlot(){
    
    for( var i = state.setBeginingHour; i <= state.setEndingHour; i++ ){
            var content = 
                        `<div class="row">
                            <div class="hour" data-hour=${i}>${ i <= 12 ? i+'AM' : i-12+'PM' }</div>
                            <textarea class="content"></textarea>
                            <button class="btn">
                                <svg class="icon icon-save-disk">
                                    <use xlink:href="./assets/sprite.svg#icon-save-disk">
                                    </use>
                                </svg>
                                <p>save</p>
                            </button>
                        </div>`

            $('main').append(content);
    }

    $('[data-hour=12]').text('12 NOON');

}
// Import data from localStorage
function fromLocalStorage(){
    for( var i = state.setBeginingHour ; i <= state.setEndingHour ; i++ ){
            var savedText = localStorage.getItem(JSON.stringify(i))
            $(`[data-hour=${i}]`).siblings('textarea').val(savedText);
    }
}
// Paint textarea field's bg
function colorField(){

    // 1. Remove previous 'current' color change
    $('[class ~= "current"]').removeClass('current');

    // 2. Paint all fields accordingly
    $('.hour').each(function(){
       
        var hourNum = $(this).attr('data-hour'); // 9 - 17
        var hourToCompare = moment().hour(hourNum);

        // if current moment's hour === field's hour
        if(moment().isSame(hourToCompare, 'hour')){
            $(this).next().addClass('current');
        }
        // if current moment's hour is after field's hour
        else if(moment().isAfter(hourToCompare, 'hour')){
            $(this).next().addClass('past');
        }

    })
}
// Timer( Update state data / Render header time / Detect hour change )
function timeSensor(){

    setInterval(()=>{

        var momentObj = moment();

        // 1. State data update
        state.currentHour = momentObj.hour();
        state.formatedTime = momentObj.format('dddd, MMM Do YYYY, h:mm A');

        // 2. Render header time DOM
        $('#currentTime').text(state.formatedTime);

        // 3. Detect hour change and renew textarea field's bg color accordingly
        if(state.startHour !== state.currentHour){ colorField() }

    },500);
    
}  
// Render 'Saved' pop message
function renderSavedPop(clickedBtn){
    $(clickedBtn).addClass('pop');
    setTimeout( function(){ $(clickedBtn).removeClass('pop') },500 );
}
function init(){

    state.startHour = moment().hour();
    renderTimeSlot();
    fromLocalStorage();
    colorField();
    timeSensor();

}


// Button event 
$('main').click(function(e){

    if(e.target.matches('button, button *')){
        
        var button = $(e.target).closest('button');

        // Get hour & data then save to localStorage
        var hourForRecord = button.siblings('.hour').attr('data-hour'); // 10
        var dataForRecord = button.siblings('.content').val().trim();

        if(dataForRecord){
            localStorage.setItem(hourForRecord,dataForRecord);
            renderSavedPop(button);
        }
    }
   
})

init();


})