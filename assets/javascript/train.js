
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
var hourFormat;

// checks current time with first train time with moment.js
var timeCheck = function() {
	var hourFormat = "h:mm";
	var convertedFirstTrainTimeForm = moment(firstTrainTimeForm).format(hourFormat);
	var convertedFrequencyForm = moment(frequencyForm).format("mm");
	var currentTime = moment().format(hourFormat);

	if (currentTime < convertedFirstTrainTimeForm) {
		var nextArrival = convertedFirstTrainTimeForm;
	}
	else if (currentTime == convertedFirstTrainTimeForm) {
		var nextArrival = "Train is here";
	}
	else if (currentTime > convertedFirstTrainTimeForm) {
		while (currentTime > convertedFirstTrainTimeForm) {
			convertedFirstTrainTimeForm.add(convertedFrequencyForm, "minutes").calendar
			var nextArrival = convertedFirstTrainTimeForm;
		}
	}
	var minutesAway = currentTime.diff(nextArrival, "minutes");

};

// gets user forms and gives them to firebase
var formToFirebase = function() {
	event.preventDefault();
	// get values from user inputed forms
	trainForm = $("#train-form").val().trim();
	destinationForm = $("#destination-form").val().trim();
	firstTrainTimeForm = $("#first-train-time-form").val().trim();
	frequencyForm = $("#frequency-form").val().trim();
	timeCheck();
	// Change what is saved in firebase
    database.ref().push ({
    	trainForm: trainForm,
        destinationForm: destinationForm,
        frequencyForm: frequencyForm,
        nextArrival: nextArrival,
        minutesAway: minutesAway
    });
};

// dynamically creates tables
var tableCreator = function(childSnapshot) {
	trainForm = childSnapshot.val().trainForm;
    destinationForm = childSnapshot.val().destinationForm;
    frequencyForm = childSnapshot.val().frequencyForm;
    nextArrival = childSnapshot.val().nextArrival;
    minutesAway = childSnapshot.val().minutesAway;

    
	
	tableTr = $("<tr>");
	tableTr.append("<td>" + trainForm + "</td>");
    tableTr.append("<td>" + destinationForm + "</td>");
    tableTr.append("<td>" + frequencyForm + "</td>");
    tableTr.append("<td>" + monthsWorked + "</td>");
    tableTr.append("<td>" + nextArrival + "</td>");
    tableTr.append("<td>" + minutesAway + "</td>");
	
	
	$("#train-table").append(tableTr);

}, 
// function(errorObject) {
//       console.log("The read failed: " + errorObject.code);
// }

// take text in forms and sends it to firebase
$("#submit").on("click", formToFirebase);

// when database has new values, create tables accordingly
database.ref().on("child_added", tableCreator);
