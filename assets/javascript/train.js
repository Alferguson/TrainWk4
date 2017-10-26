
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

var trainForm;
var destinationForm;
var firstTrainTimeForm;
var frequencyForm;
var nextArrival;
var minutesAway;
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
		debugger;
		var nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");
		debugger;
	}
	else {
		nextArrival = convertedFirstTrainTimeForm.format("HH:mm");
		minutesAway = timeDifferent * -1;
	}	

    database.ref().push ({
    	trainFormRef: trainForm,
        destinationFormRef: destinationForm,
        frequencyFormRef: frequencyForm,
        nextArrivalRef: nextArrival,
        minutesAwayRef: minutesAway
    });
    // var postId = database.ref().push().key;
});


var update = function () {
	var currentTime = moment();

	var convertedFirstTrainTimeForm = moment(firstTrainTimeForm, "HH:mm");

	var timeDifferent = moment().diff(moment(convertedFirstTrainTimeForm), "minutes");
	// if loop to determine if the first train arrival is after the current time
	if (timeDifferent > 0) {
		var remainder = timeDifferent % frequencyForm;
		var minutesAway = frequencyForm - remainder;
		debugger;
		var nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");
		debugger;
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
	debugger;

	trainForm = childSnapshot.val().trainFormRef;
    destinationForm = childSnapshot.val().destinationFormRef;
    frequencyForm = childSnapshot.val().frequencyFormRef;
    nextArrival = childSnapshot.val().nextArrivalRef;
    minutesAway = childSnapshot.val().minutesAwayRef;
    keyId = childSnapshot.key;
    
  
	// to make a new row for when data is submitted
	tableTr = $("<tr>");
	tableTr.append("<td>" + trainForm + "</td>");
    tableTr.append("<td>" + destinationForm + "</td>");
    tableTr.append("<td>" + frequencyForm + "</td>");
    tableTr.append("<td>" + nextArrival + "</td>");
    tableTr.append("<td>" + minutesAway + "</td>");
	
	
	$("#train-table").append(tableTr);

	timerFunc = setInterval(update, 60000);

}), 
function(errorObject) {
      console.log("The read failed: " + errorObject.code);
}

database.ref().on("child_changed", function(childSnapshot) {
	$("#train-table").empty();

	// to make a new row for when data is submitted
	tableTr = $("<tr>");
	tableTr.append("<td>" + trainForm + "</td>");
    tableTr.append("<td>" + destinationForm + "</td>");
    tableTr.append("<td>" + frequencyForm + "</td>");
    tableTr.append("<td>" + nextArrival + "</td>");
    tableTr.append("<td>" + minutesAway + "</td>");
	
	
	$("#train-table").append(tableTr);

	timerFunc = setInterval(update, 60000);


});
