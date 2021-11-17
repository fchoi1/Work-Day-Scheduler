var currentDate = moment().format('LL')
var currentDateString = moment().format("dddd MMMM Do YYYY");

var dailytask = []; // {Starttime: , Endtime:, taskName: ,} 

var workHours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM']; // Create array for work hours

$("#currentDay").text(currentDateString);

console.log(currentDate);


var createTimeBlock = function(){
    var timeBlcokContainerEl = $(".container");
    for (hour of workHours){
        // Create Time Blocks
        var timeBlockEl = $("<div>").addClass("time-block row ");
        timeBlockEl.data("hour", hour);
        timeBlockEl.data("date", currentDate);
        timeBlockEl.addClass("row");

        // Time Display Element
        var timeBlockTitleEl = $("<span>").text(hour);
        timeBlockTitleEl.addClass("col-2 hour");

        // Main Info Element
        var eventInfoBlockEl = $("<div>").addClass("event-info-area col-8");

        // Button elemet
        var saveEventEl = $("<button>").addClass("btn saveBtn col-2");
        saveEventEl.html("<i class='bi bi-save'></i>");

        timeBlockEl.append(timeBlockTitleEl,eventInfoBlockEl,saveEventEl)    
        
        timeBlcokContainerEl.append(timeBlockEl);
    }
}

var updateTimeBlock(timeBlockEl){
    var currentTime = moment().format('HH');

    // Check if time passed, coming up, or in the future
    if (currentTime < timeBlockEl.data('hour'))
    {
        timeBlockEl.toggleClass('event-info-area')

    }

}
createTimeBlock();
