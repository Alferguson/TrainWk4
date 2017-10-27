// to initialize firebase
var config = {
    apiKey: "AIzaSyBpibu-G0Uoyl7gSPIL9JrdfS3IOAcmisQ",
    authDomain: "trainwk4-12c7c.firebaseapp.com",
    databaseURL: "https://trainwk4-12c7c.firebaseio.com",
    projectId: "trainwk4-12c7c",
    storageBucket: "trainwk4-12c7c.appspot.com",
    messagingSenderId: "897917821206"
  };
firebase.initializeApp(config);

var database = firebase.database();
// variable declarations
var trainForm;
var destinationForm;
var firstTrainTimeForm;
var convertedFirstTrainTimeForm;
var frequencyForm;
var timeDifferent;
var nextArrival;
var minutesAway;
var remainder;
var currentTime;
var tableTd;
var tableTr;

// gets user forms and gives them to firebase
$("#submit").on("click", function() {
	event.preventDefault();
	// get values from user inputed forms
	trainForm = $("#train-form").val().trim();
	destinationForm = $("#destination-form").val().trim();
	firstTrainTimeForm = $("#first-train-time-form").val().trim();
	frequencyForm = $("#frequency-form").val().trim();
	// checks current time with first train time with moment.js
	var currentTime = moment();
	
	var convertedFirstTrainTimeForm = moment(firstTrainTimeForm, "HH:mm");
	
	var timeDifferent = moment().diff(moment(convertedFirstTrainTimeForm), "minutes");
	// if loop to determine if the first train arrival is after the current time
	if (timeDifferent > 0) {
		var remainder = timeDifferent % frequencyForm;
		var minutesAway = frequencyForm - remainder;
		var nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");
	}
	// if first arrival is after current time, just used converted first train time for next arrival
	else {
		nextArrival = convertedFirstTrainTimeForm.format("HH:mm");
		minutesAway = timeDifferent * -1;
	}	
	// push data to firebase
    database.ref().push ({
    	trainFormRef: trainForm,
        destinationFormRef: destinationForm,
        frequencyFormRef: frequencyForm,
        nextArrivalRef: nextArrival,
        minutesAwayRef: minutesAway
    });
});

// update function every minute, doesn't work
var update = function () {
	// set current time and convert user inputs to hours and minutes
	var currentTime = moment();
	var convertedFirstTrainTimeForm = moment(firstTrainTimeForm, "HH:mm");
	var timeDifferent = moment().diff(moment(convertedFirstTrainTimeForm), "minutes");
	// if loop to determine if the first train arrival is after the current time
	if (timeDifferent > 0) {
		var remainder = timeDifferent % frequencyForm;
		var minutesAway = frequencyForm - remainder;
		var nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");
	}
	else {
		nextArrival = convertedFirstTrainTimeForm.format("HH:mm");
		minutesAway = timeDifferent * -1;
	}
	database.ref().update({
		nextArrivalRef: nextArrival,
		minutesAwayRef: minutesAway
	})	
}

// dynamically creates tables
database.ref().on("child_added", function(childSnapshot) {
	// set variables to what firebase has
	trainForm = childSnapshot.val().trainFormRef;
    destinationForm = childSnapshot.val().destinationFormRef;
    frequencyForm = childSnapshot.val().frequencyFormRef;
    nextArrival = childSnapshot.val().nextArrivalRef;
    minutesAway = childSnapshot.val().minutesAwayRef;
    

	// to make a new row for when data is submitted
	tableTr = $("<tr>");
	tableTr.append("<td>" + trainForm + "</td>");
    tableTr.append("<td>" + destinationForm + "</td>");
    tableTr.append("<td>" + frequencyForm + "</td>");
    tableTr.append("<td>" + nextArrival + "</td>");
    tableTr.append("<td>" + minutesAway + "</td>");
	
	// append to html id train table
	$("#train-table").append(tableTr);
	setInterval(timeUpdater, 1000);
	// timer function to update data, doesn't work
	
}), 
function(errorObject) {
      console.log("The read failed: " + errorObject.code);
}

// function newUpdate() {
	
// }


// to upate tables every minute 
// database.ref().on("value", function(childSnapshot) {
// 	setInterval(newUpdate, 60000);
// }) 


// Update minutes away by triggering change in firebase children
    function timeUpdater() {
    	debugger;
    var currentTime = moment();
	var convertedFirstTrainTimeForm = moment(firstTrainTimeForm, "HH:mm");
	var timeDifferent = moment().diff(moment(convertedFirstTrainTimeForm), "minutes");
	// if loop to determine if the first train arrival is after the current time
	if (timeDifferent > 0) {
		var remainder = timeDifferent % frequencyForm;
		var minutesAway = frequencyForm - remainder;
		var nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");
	}
	else {
		nextArrival = convertedFirstTrainTimeForm.format("HH:mm");
		minutesAway = timeDifferent * -1;
	}
database.ref().once('value', function(snapshot){
	
        snapshot.forEach(function(childSnapshot){
          database.ref(childSnapshot).update({
          minutesAwayRef: minutesAway,
          nextArrivalRef: nextArrival
          
          })
        })    
      });
    };

	// // to make a new row for when data is submitted
	// tableTr = $("<tr>");
	// tableTr.append("<td>" + trainForm + "</td>");
 //    tableTr.append("<td>" + destinationForm + "</td>");
 //    tableTr.append("<td>" + frequencyForm + "</td>");
 //    tableTr.append("<td>" + nextArrival + "</td>");
 //    tableTr.append("<td>" + minutesAway + "</td>");
	
	// // append to html id train table
	// $("#train-table").append(tableTr);
      

    
// // doesn't really work either
// database.ref().on("child_changed", function(childSnapshot) {
// 	$("#train-table").empty();

// 	// to make a new row for when data is submitted
// 	tableTr = $("<tr>");
// 	tableTr.append("<td>" + trainForm + "</td>");
//     tableTr.append("<td>" + destinationForm + "</td>");
//     tableTr.append("<td>" + frequencyForm + "</td>");
//     tableTr.append("<td>" + nextArrival + "</td>");
//     tableTr.append("<td>" + minutesAway + "</td>");
	
// 	$("#train-table").append(tableTr);

// 	timerFunc = setInterval(update, 60000);
// });
