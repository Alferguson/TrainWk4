
var config = {
  apiKey: "AIzaSyAJS4YQWU5DmESeYueG1qH1NGkjv3DncEY",
  authDomain: "fir-click-counter-7cdb9.firebaseapp.com",
  databaseURL: "https://fir-click-counter-7cdb9.firebaseio.com",
  storageBucket: "fir-click-counter-7cdb9.appspot.com"
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
var trainTd;
var destinationTd;
var frequencyTd;
var nextArrivalTd;
var minutesAwayTd;
var tableTr;
var tableTbody;


// gets user forms and gives them to firebase
var formToFirebase = function() {
	event.preventDefault();
	// get values from user inputed forms
	trainForm = $("#train-form").val().trim();
	destinationForm = $("#destination-form").val().trim();
	firstTrainTimeForm = $("#first-train-time-form").val().trim();
	frequencyForm = $("#frequency-form").val().trim();

	// Change what is saved in firebase
    database.ref().set({
    	trainForm: trainForm,
        destinationForm: destinationForm,
        firstTrainTimeForm: firstTrainTimeForm,
        frequencyForm: frequencyForm
    });
}
// checks current time with first train time
var timeCheck = function() {
	if (currentTime < firstTrainTimeForm) {
		var nextArrival = firstTrainTimeForm;
	}
	else if (currentTime == firstTrainTimeForm) {
		var nextArrival = "Train is here";
	}
	else if (currentTime > firstTrainTimeForm) {
		for (currentTime > firstTrainTimeForm) {
			firstTrainTimeForm = firstTrainTimeForm + frequencyForm;
			var nextArrival = firstTrainTimeForm;
		}
	}
	// display nextArrival
	var minutesAway = nextArrival - currentTime;
	// display minutesAway
}
// dynamically creates tables
var tableCreator = function() {
	tableTd = $("<td>");
	trainTd = tableTd.text(trainForm);
	destinationTd = tableTd.text(destinationForm);
	frequencyTd = tableTd.text(frequencyForm);
	nextArrivalTd = tableTd.text(timeCheck());
	minutesAwayTd = tableTd.text(timeCheck());
	tableTr = $("<tr>");
	tableTbody = $("<tbody>");
	tableTbody.append(tableTr.append(destinationTd, frequencyTd, nextArrivalTd, minutesAwayTd));

}

// When changes occurs it will print them to console and html
database.ref().on("value", function(snapshot) {
	 // Print the initial data to the console.
      console.log(snapshot.val());

      // Log the value user data
      console.log(snapshot.val().trainForm);
      console.log(snapshot.val().destinationForm);
      console.log(snapshot.val().firstTrainTimeForm);
      console.log(snapshot.val().frequencyForm);

      // Change html of train-table id to dynamically created table points
      $("#train-table").append(snapshot.val().name + " | " + snapshot.val().age + " | " + snapshot.val().phone);

}, function(errorObject) {
      console.log("The read failed: " + errorObject.code);




// take text in forms and sends it to firebase
$("#submit").on("click", formToFirebase());