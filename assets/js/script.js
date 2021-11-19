var currentDate = moment().format('LL')
var currentDateString = moment().format("dddd MMMM Do YYYY");

var dailytask = []; // { date: [time: [ taskName:   ]]} 

var workHours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM']; // Create array for work hours


$("#currentDay").text(currentDateString);

console.log(currentDate);

var createTimeBlock = function(){
    var timeBlcokContainerEl = $(".container");
    for (hour of workHours){
        // Create Time Blocks
        let timeBlockEl = $("<div>").addClass("time-block row ");
        timeBlockEl.attr({
            "data-hour": hour,
            "data-date": currentDate
        });

        // Time Display Element
        let timeBlockTitleEl = $("<span>").text(hour);
        timeBlockTitleEl.addClass("col-2 hour p-3");

        // Main Info Element and Main Text Area for creating new tasks
        let eventInfoBlockEl = $("<div>").addClass("event-info-area col-8 d-flex flex-column justify-content-end");
        let eventInfoBlockTextEl = $("<textarea>").addClass("event-text-area create-text-area form-control-sm border border-dark rounded "); // For inputting events on that hour
        eventInfoBlockTextEl.attr("placeholder", "Submit New Task Details");
        
        // let eventInfoBlockTextEl2 = $("<textarea>").addClass("event-text-area form-control-sm border border-dark rounded "); // For inputting events on that hour
        // eventInfoBlockTextEl2.attr("placeholder", "Submit New Task Details");
        eventInfoBlockEl.append(eventInfoBlockTextEl);
        
        // Button elemet
        let saveEventEl = $("<button>").addClass("btn saveBtn col-2");
        saveEventEl.html("<i class='bi bi-save'></i>");

        timeBlockEl.append(timeBlockTitleEl,eventInfoBlockEl,saveEventEl)    
        timeBlcokContainerEl.append(timeBlockEl);
    }
}

var updateTimeBlock = function(timeBlockEl){
    var currentTime = moment().format('HH');

    // Check if time passed, coming up, or in the future
    if (currentTime < timeBlockEl.data('hour')){

        timeBlockEl.toggleClass('bg-light');

    }else if (false)// some moment js logic){
    {
        timeBlockEl.toggleClass('bg-warning');


    } else if(true){

    }
}

var createEventTasks = function(dailytaskArray){
    // Get current date and display only for current day events
    for (time in dailytaskArray[currentDate]){
        console.log("time", time);
        if(!time){ // If there tasks at that hour

        }
    }   
}

var saveButtonHandler = function(){
    let timeBlockEl = $(this).parent();
    let hour = timeBlockEl.data('hour');
    let date = timeBlockEl.data('date');
    // Get list of text area to be updated, this means it is edited or new
    var eventTextAreas = timeBlockEl.find(".event-text-area");
    
    eventTextAreas.each(function(){
        
        eventText = $(this).val().trim(); // Get text area value
        dailytask[date][hour] = []; // Reset the event tasks, full list updated every save

        if (eventText){ // Check if text area is not empty
            // Change the text area back to p
            let eventInfoBlockPEl = $("<p>").addClass("event-text small text-left p-0 my-auto");
            eventInfoBlockPEl.text(eventText);

            // Dont replace the last element, append instead
            if (textArea = eventTextAreas[eventTextAreas.length-1]){ // Add to array if new task
                $(this).before(eventInfoBlockPEl);
            } else {
                textArea.replaceWith(eventInfoBlockPEl); // Replace element
            }
            // update daily task
            dailytask[date][hour].push(eventText);
        }  
    });

    saveEvents();
    console.log("save tasks", dailytask);

    //Reset text area
    $(this).val("");
}

// Save events to local storage
var saveEvents = function(){
    localStorage.setItem("DailyTasks", JSON.stringify(dailytask));
}

// Load events to local storage
var loadEvents = function(){
    dailytask = JSON.parse(localStorage.getItem("DailyTasks"));

    if (!dailytask){ // If it doesn't exist
        let newDailytask = {};
        newDailytask[currentDate] = {};
        for (hour of workHours){  
            // Create the hour objects based on the workHours above
            newDailytask[currentDate][hour] = [];
        }
        dailytask = newDailytask;
    }
    console.log("loading event for the day", dailytask);

    // Create Elements
    createTimeBlock();
    createEventTasks(dailytask);

}


// Saving new/edited events button
$(".container").on("click", ".saveBtn", saveButtonHandler);

loadEvents();
