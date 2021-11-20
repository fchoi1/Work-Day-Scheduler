var currentDate = moment().format('LL')
var currentDateString = moment().format("dddd MMMM Do YYYY");

// Array is designed to handle multiple days!!!s
var dailytask = []; // { date: [time: [ taskName:   ]]} 

var workHours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM']; // Create array for work hours

const paragraphClass = "event-text small text-left my-1 font-weight-light text-body";
const textAreaCreateClass = "event-text-area create-text-area small form-control-sm border border-dark rounded my-1";
const textAreaEditClass = "event-text-area form-control-sm small border border-dark rounded my-1";

$("#currentDay").text(currentDateString); // Update current date

console.log(currentDate);

// Create Initial elements based on work hours (default is hardcoded above)
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
        timeBlockTitleEl.addClass("col-12 col-md-2 col-lg-1 hour p-3");

        // Main Info Element and Main Text Area for creating new tasks
        let eventInfoBlockEl = $("<div>").addClass("event-info-area col-12 col-md-9 col-lg-10 d-flex flex-column justify-content-end");
        let eventInfoBlockTextEl = $("<textarea>").addClass(textAreaCreateClass); // For inputting events on that hour
        eventInfoBlockTextEl.attr("placeholder", "Submit New Task Details");

        eventInfoBlockEl.append(eventInfoBlockTextEl);
        
        // Button elemet
        let saveEventEl = $("<button>").addClass("btn saveBtn col-12 col-md-1");
        saveEventEl.html("<i class='bi bi-save'></i>");

        timeBlockEl.append(timeBlockTitleEl,eventInfoBlockEl,saveEventEl);
        timeBlcokContainerEl.append(timeBlockEl);
    }
}

//Update time block colours based on time
var updateTimeBlock = function(timeBlockEl){
    var timeBlockdate = timeBlockEl.attr("data-date");
    var timeBlockHour = timeBlockEl.attr("data-hour");
    var momentTimeBlock = moment(timeBlockdate + " " + timeBlockHour, "MMMM Do YYYY h A");
    var currentDateTime = moment(); //.format(" MMMM Do YYYY hh a")
    // console.log(currentDateTime,timeBlockDate,momentTimeBlock);
    console.log("date to compare", timeBlockdate, timeBlockEl)
    // Check if time passed, coming up, or in the future
    if (moment(currentDateTime).isAfter(momentTimeBlock)){
        //console.log("time passed, current: " + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"))
        timeBlockEl.removeClass('present future');
        timeBlockEl.addClass('past');
    }else if(Math.abs(moment(currentDateTime).diff(momentTimeBlock, "hours")) < 1){
        //console.log("within an hour");
        timeBlockEl.removeClass('past future');
        timeBlockEl.addClass('present');
    }else{
        //console.log("not passed");
        timeBlockEl.removeClass('present past');
        timeBlockEl.addClass('future');
    }
}

// Used to create events
var createEventTasks = function(dailytaskArray,useDate=null){
    // clear child elements and re-create them except for text area
    $(".event-info-area").find('*').not('.create-text-area').remove();

    var currDate = '';
    if(!useDate){
        currDate = currentDate;
    }else{
        currDate = useDate;
    }
    // Get current date and display only for current day events
    for (time in dailytaskArray[currDate]){
        var timeObj = dailytaskArray[currDate][time];
        //console.log("selector: ", ".time-block[data-hour='"  + time + "'][data-date='" + currentDate +"'] ");
        var currentTimeBlockEl = $(".time-block[data-hour='"  + time + "'][data-date='" + currentDate +"'] ");
        // Update color
        console.log("update color", currentTimeBlockEl);

        updateTimeBlock(currentTimeBlockEl);
        if(timeObj.length !== 0){ // If there tasks at that hour
            // Find correct time block text area based on time
            let timeBlockTextAreaEl = currentTimeBlockEl.children(".event-info-area").children(".event-text-area");                 
            for(task of timeObj){
                // Create paragraph element
                let taskPEl = $("<p>").addClass(paragraphClass).text(task);
                timeBlockTextAreaEl.before(taskPEl);
            }
        }
    } 
    console.log("Successfull updated tasks from array"); 
}

// Saving tasks 
var saveButtonHandler = function(){
    let timeBlockEl = $(this).parent();
    let hour = timeBlockEl.attr('data-hour');
    let date = timeBlockEl.attr('data-date');
    // Get list of text area to be updated, this means it is edited or new
    var eventTextAreas = timeBlockEl.find(".event-text-area, .event-text");
    dailytask[date][hour] = []; // Reset the event tasks, full list updated every save, easier

    eventTextAreas.each(function(){ // loop through each element
        if($(this).is("p")){
            eventText = $(this).text().trim(); // Get text area value for p element
            dailytask[date][hour].push(eventText); // update daily task

        }else if($(this).is("textarea")){
            eventText = $(this).val().trim(); // Get text area value for textarea element
            if (eventText !== ''){ // Check if text area is not empty and not the create text area element
                // Change the text area back to p
                let eventInfoBlockPEl = $("<p>").addClass(paragraphClass);
                eventInfoBlockPEl.text(eventText);

                if($(this).hasClass("create-text-area")){ // Add to array if new task in create text area
                    $(this).before(eventInfoBlockPEl);
                    $(this).val(""); // reset textarea
                }else{
                    // Dont replace the text area to create text
                    $(this).replaceWith(eventInfoBlockPEl); // Replace element
                }
                dailytask[date][hour].push(eventText); // update daily task
            }else if(!$(this).hasClass("create-text-area")){  // make sure to not add in array
                $(this).remove(); // Remove task if text area is empty (and not create-text area)
            }
        }
        
    });
    saveEvents();
    console.log("save tasks", dailytask);
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

var editTaskHandler = function(){
    let text = $(this).text();
    // Create a text input to replace the p element
    let textInput = $("<textarea>").addClass(textAreaEditClass).val(text);
    $(this).replaceWith(textInput);
    textInput.focus();
}

var updateTimeBlockDate = function(date){
    // update date in data set
    $(".container").find(".time-block").each(function(index, el){
        $(this).attr('data-date', date);
    });
}

// Used to update and color code tasks every 30 mins
setInterval(function(){
    $(".time-block").each(function(index,el){
        updateTimeBlock($(this));
    });
  }, (1000 * 60) *30); // 30 mins in seconds

// Next Day Tasks
$("#nextDay").on("click", function(){
    // add a day to currentDate and Date string

    currentDate = moment(currentDate, 'LL').add(1,'d').format('LL');
    currentDateString = moment(currentDateString, '"dddd MMMM Do YYYY"')
        .add(1,'d')
        .format("dddd MMMM Do YYYY");
    // Create new array if new it doesn't exist:
    if(!dailytask[currentDate] ){
        dailytask[currentDate] = {};
        for (hour of workHours){  
            dailytask[currentDate][hour] = [];
        }
        console.log("No entry exist, need to create")
    }
    updateTimeBlockDate(currentDate);
    $("#currentDay").text(currentDateString); // Update current date
    createEventTasks(dailytask);
});

// Previous Day Tasks
$("#previousDay").on("click", function(){
    // suibtract a day to currentDate
    currentDate = moment(currentDate, 'LL').subtract(1,'d').format('LL');
    currentDateString = moment(currentDateString, '"dddd MMMM Do YYYY"')
        .subtract(1,'d')
        .format("dddd MMMM Do YYYY");
    updateTimeBlockDate(currentDate);
    $("#currentDay").text(currentDateString); // Update current date
    createEventTasks(dailytask);
});

// Allow to edit tasks
$(".container").on("click", ".event-text", editTaskHandler);

// Saving new/edited events button
$(".container").on("click", ".saveBtn", saveButtonHandler);

loadEvents();
